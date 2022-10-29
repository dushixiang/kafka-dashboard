import React, {Component} from 'react';
import {Button, PageHeader, Statistic, Tabs, Row, Space, notification} from "antd";
import TopicPartition from "./TopicPartition";
import TopicBroker from "./TopicBroker";
import TopicConsumerGroup from "./TopicConsumerGroup";
import {Link} from "react-router-dom";
import request from "../common/request";
import {renderSize} from "../utils/utils";
import TopicConfig from "./TopicConfig";
import {FormattedMessage} from "react-intl";
import SendMessageModal from "./SendMessageModal";

const {TabPane} = Tabs;

class TopicInfo extends Component {

    state = {
        clusterId: undefined,
        topic: undefined,
        topicDataVisible: false,
        topicInfo: {
            'partitions': []
        },
    }

    componentDidMount() {
        let urlParams = new URLSearchParams(this.props.location.search);
        let clusterId = urlParams.get('clusterId');
        let topic = urlParams.get('topic');
        this.setState({
            clusterId: clusterId,
            topic: topic,
        })
        this.loadTopicInfo(clusterId, topic);
    }

    handleTabChange(key) {

    }

    onTopicPartitionRef = (topicPartitionRef) => {
        this.setState({
            topicPartitionRef: topicPartitionRef
        })
    }

    onTopicBrokerRef = (topicBrokerRef) => {
        this.setState({
            topicBrokerRef: topicBrokerRef
        })
    }

    onTopicConsumerGroupRef = (topicConsumerGroupRef) => {
        this.setState({
            topicConsumerGroupRef: topicConsumerGroupRef
        })
    }

    loadTopicInfo = async (clusterId, topic) => {
        let result = await request.get(`/topics/${topic}?clusterId=${clusterId}`);
        this.setState({
            topicInfo: result
        })
    }

    handleSendMessage = async (values) => {
        this.setState({
            modalConfirmLoading: true
        })
        try {
            let offset = await request.post(`/topics/${this.state.topic}/data?clusterId=${this.state.clusterId}`, values);
            notification['success']({
                message: '提示',
                description: `发送数据成功，位于 offset ${offset}。`,
            });
        } finally {
            this.setState({
                modalVisible: false,
                modalConfirmLoading: false
            });
        }

        if (this.state.topicPartitionRef) {
            this.state.topicPartitionRef.refresh();
        }
        if (this.state.topicBrokerRef) {
            this.state.topicBrokerRef.refresh();
        }
        if (this.state.topicConsumerGroupRef) {
            this.state.topicConsumerGroupRef.refresh();
        }

        return true;
    }

    render() {

        return (
            <div>
                <div className='kd-page-header'>
                    <PageHeader
                        className="site-page-header"
                        onBack={() => {
                            this.props.history.goBack();
                        }}
                        subTitle={<FormattedMessage id="topic-detail"/>}
                        title={this.state.topic}
                        extra={[
                            <Button key="btn-1" onClick={() => {
                                this.setState({
                                    modalVisible: true
                                })
                            }}><FormattedMessage id="produce-message"/></Button>,
                            <Link key={'link-2'}
                                  to={`/topic-data?clusterId=${this.state.clusterId}&topic=${this.state.topic}`}>
                                <Button key="btn-consume-message" type="primary">
                                    <FormattedMessage id="consume-message"/>
                                </Button>
                            </Link>,
                            <Link key={'link-3'}
                                  to={`/topic-data-live?clusterId=${this.state.clusterId}&topic=${this.state.topic}`}>
                                <Button key="btn-consume-message" type="primary">
                                    <FormattedMessage id="consume-message-live"/>
                                </Button>
                            </Link>,
                        ]}
                    >
                        <Row>
                            <Space size='large'>
                                <Statistic title={<FormattedMessage id="numPartitions"/>}
                                           value={this.state.topicInfo['partitions'].length}/>
                                <Statistic title={<FormattedMessage id="replicationFactor"/>}
                                           value={this.state.topicInfo['replicaCount']}/>
                                <Statistic title={<FormattedMessage id="log-size"/>}
                                           value={renderSize(this.state.topicInfo['totalLogSize'])}/>
                            </Space>
                        </Row>
                    </PageHeader>
                </div>

                <div className='kd-content'>
                    <Tabs defaultActiveKey='0' onChange={this.handleTabChange}>
                        <TabPane tab={<FormattedMessage id="partitions"/>} key="partition">
                            <TopicPartition
                                clusterId={this.state.clusterId}
                                topic={this.state.topic}
                                onRef={this.onTopicPartitionRef}
                            >

                            </TopicPartition>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="brokers"/>} key="broker">
                            <TopicBroker
                                clusterId={this.state.clusterId}
                                topic={this.state.topic}
                                onRef={this.onTopicBrokerRef}
                            >
                            </TopicBroker>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="consumer-groups"/>} key="consumer-group">
                            <TopicConsumerGroup
                                clusterId={this.state.clusterId}
                                topic={this.state.topic}
                                onRef={this.onTopicConsumerGroupRef}
                            >

                            </TopicConsumerGroup>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="topic-config"/>} key="topic-config">
                            <TopicConfig
                                clusterId={this.state.clusterId}
                                topic={this.state.topic}>

                            </TopicConfig>
                        </TabPane>
                    </Tabs>
                </div>

                {
                    this.state.modalVisible ?
                        <SendMessageModal
                            partitions={this.state.topicInfo.partitions}
                            handleOk={this.handleSendMessage}
                            handleCancel={() => {
                                this.setState({
                                    modalVisible: false
                                })
                            }}
                            confirmLoading={this.state.modalConfirmLoading}
                        /> : undefined
                }
            </div>
        );
    }
}

export default TopicInfo;