import React, {Component} from 'react';
import request from "../common/request";
import {Button, Table, Tooltip} from "antd";
import {FormattedMessage} from "react-intl";

class TopicBroker extends Component {

    state = {
        loading: false,
        items: [],
    }

    componentDidMount() {
        let clusterId = this.props.clusterId;
        let topic = this.props.topic;
        this.setState({
            clusterId: clusterId,
            topic: topic
        })
        this.props.onRef(this);
        this.loadItems(clusterId, topic);
    }

    async loadItems(clusterId, topic) {
        this.setState({
            loading: true
        })
        let items = await request.get(`/topics/${topic}/brokers?clusterId=${clusterId}`);
        this.setState({
            items: items,
            loading: false
        })
    }

    refresh() {
        if (this.state.clusterId && this.state.topic) {
            this.loadItems(this.state.clusterId, this.state.topic)
        }
    }

    render() {

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            defaultSortOrder: 'ascend',
        }, {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
        }, {
            title: 'Partitions as Leader',
            dataIndex: 'leaderPartitions',
            key: 'leaderPartitions',
            render: (leaderPartitions, record, index) => {
                return <Tooltip title={leaderPartitions.join('、')}>
                    <Button type="link" size='small'>{leaderPartitions.length}</Button>
                </Tooltip>;
            }
        }, {
            title: 'Partitions as Follower',
            dataIndex: 'followerPartitions',
            key: 'followerPartitions',
            render: (followerPartitions, record, index) => {
                return <Tooltip title={followerPartitions.join('、')}>
                    <Button type="link" size='small'>{followerPartitions.length}</Button>
                </Tooltip>;
            }
        }];

        return (
            <div>
                <Table
                    rowKey='id'
                    dataSource={this.state.items}
                    columns={columns}
                    position={'both'}
                    loading={this.state.loading}
                    size={'middle'}
                    pagination={{
                        showSizeChanger: true,
                        total: this.state.items.length,
                        showTotal: total => <FormattedMessage id="total-items" values={{total}}/>
                    }}
                />
            </div>
        );
    }
}

export default TopicBroker;