# kafka map

给编程插上翅膀，给kafka安装上导航。

## 快速了解

`kafka map`是使用`Java8`和`React`给`Apache Kafka`开发的一款web ui工具。
通过这款工具可以很方便直观的查看Broker、 topics、 partitions、consumers等信息，以及查看Topic中的消息。

目前支持的功能有：

- 多集群管理
- topic监控 —— 查看分区数量、副本数量、存储大小、offset
- topic管理 —— 创建、删除、扩容
- broker查看 —— Partitions as Leader、	Partitions as Follower
- consumer管理（查看、删除）
- 重置offset
- 消费消息 —— 支持String和json方式展示

## 截图

[截图](docs/screenshot.md)

## 协议与条款

如您需要在企业网络中使用 `kafka-map` ，建议先征求 IT 管理员的同意。下载、使用或分发 `kafka-map` 前，您必须同意 [协议](./LICENSE) 条款与限制。本项目不提供任何担保，亦不承担任何责任。

## 依赖环境

- Java8 或更高版本
- Apache Kafka 1.1.0 或更高版本


## 快速安装

下载安装包并解压到你喜欢的目录

### 前台运行
进入kafka-map文件夹执行
```shell
java -jar kafka-map.jar 
```

### 系统服务方式运行

在 `/etc/systemd/system/` 下创建 `kafka-map.service` 并写入以下内容

> 根据自身实际情况修改 WorkingDirectory 和 ExecStart下面的程序所在目录及java
```shell
[Unit]
Description=kafka map service
After=network.target

[Service]
WorkingDirectory=/usr/local/kafka-map
ExecStart=/usr/bin/java -jar /usr/local/kafka-map/kafka-map.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

重载系统服务&&设置开机启动&&启动服务&&查看状态

```shell
systemctl daemon-reload
systemctl enable kafka-map
systemctl start kafka-map
systemctl status kafka-map
```

### 使用

接下来使用浏览器打开服务器的 `8080` 端口即可访问。