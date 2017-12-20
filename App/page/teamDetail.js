/**
 * Created by Cral-Gates on 2017/12/17.
 */
/**
 * Created by Cral-Gates on 2017/12/14.
 */
import React, {Component} from 'react';
import PropType from 'prop-types';
import {
    StyleSheet,
    View,
    Image,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import CommonStyle from '../style/commonStyle';
import CommonUtil from '../util/commonUtil';
import Global from '../constant/global';
import HeaderBar from '../components/headerBar';
import NetUtil from '../util/netUtil';
import {getNavigator} from '../constant/router';
import PlayerData from '../../player.json';

class TeamDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: CommonUtil.isEmpty(this.props.teamInfo.teamName) ? this.props.teamInfo[0].name : this.props.teamInfo.teamName,
            teamId: CommonUtil.isEmpty(this.props.teamInfo.teamId) ? this.props.teamInfo[0].teamId : this.props.teamInfo.teamId,
            players: [],
            baseInfo: {},
            rankInfo: {},
            stats: {},
            statsRank: {}
        };
        console.log(this.props.teamInfo);
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => this.getTeamInfo());
        this.getTeamPlayer();
    }

    render() {
        const {baseInfo, rankInfo, stats, statsRank} = this.state;
        if (CommonUtil.isEmpty(baseInfo)) {
            return <View/>;
        }
        return (
            <View style={styles.container}>
                <HeaderBar
                    title={this.state.title}
                    showLeftState={true}
                    showRightState={false}
                    showRightImage={false}
                    leftItemTitle={'数据'}
                    leftImageSource={require('../image/back.png')}
                    onPress={() => this.goBack()}/>
                <View style={styles.outline}>
                    <Image style={styles.teamLogo} source={{uri: baseInfo.teamLogo}}/>
                    <View>
                        <Text style={[styles.outlineTxt, {fontSize: 20}]}>{baseInfo.teamName}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[styles.outlineTxt, {fontSize: 30}]}>{`${rankInfo.wins}`}</Text>
                            <Text style={[styles.outlineTxt, {fontSize: 16}]}>{'胜  '}</Text>
                            <Text style={[styles.outlineTxt, {fontSize: 30}]}>{`${rankInfo.losses}`}</Text>
                            <Text style={[styles.outlineTxt, {fontSize: 16}]}>{`负`}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.outlineTxt, styles.outlineTxtSize]}>{`排名: ${rankInfo.conferenceRank}`}</Text>
                        <Text style={[styles.outlineTxt, styles.outlineTxtSize]}>{`教练: ${baseInfo.coach}`}</Text>
                        <Text style={[styles.outlineTxt, styles.outlineTxtSize]}>{`连续战绩: ${rankInfo.streak}`}</Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={styles.subTitle}>
                        <Text style={styles.subTitleTxt}>{'球队介绍'}</Text>
                    </View>
                    <Text style={styles.subContent}>&nbsp;&nbsp;&nbsp;&nbsp;{baseInfo.introduction}</Text>
                    <View style={styles.subTitle}>
                        <Text style={styles.subTitleTxt}>{'场均数据'}</Text>
                    </View>
                    {
                        this.renderTeamData(stats, statsRank)
                    }

                    <View style={styles.subTitle}>
                        <Text style={styles.subTitleTxt}>{'球队阵容'}</Text>
                    </View>
                    {
                        this.state.players.map((item, index) => this.renderPlayer(item, index))
                    }
                </ScrollView>
            </View>
        )
    }

    renderTeamData = (stats, statsRank) => {
        return (
            <View style={styles.teamData}>
                <View style={styles.teamItem}>
                    <Text style={styles.teamItemPoint}>{stats.point}</Text>
                    <Text style={styles.teamItemTitle}>{'得分'}</Text>
                    <Text style={styles.teamItemRank}>{`联盟第${statsRank.point}`}</Text>
                </View>
                <View style={styles.teamItem}>
                    <Text style={styles.teamItemPoint}>{stats.rebound}</Text>
                    <Text style={styles.teamItemTitle}>{'篮板'}</Text>
                    <Text style={styles.teamItemRank}>{`联盟第${statsRank.rebound}`}</Text>
                </View>
                <View style={styles.teamItem}>
                    <Text style={styles.teamItemPoint}>{stats.assist}</Text>
                    <Text style={styles.teamItemTitle}>{'助攻'}</Text>
                    <Text style={styles.teamItemRank}>{`联盟第${statsRank.assist}`}</Text>
                </View>
                <View style={styles.teamItem}>
                    <Text style={styles.teamItemPoint}>{stats.block}</Text>
                    <Text style={styles.teamItemTitle}>{'盖帽'}</Text>
                    <Text style={styles.teamItemRank}>{`联盟第${statsRank.block}`}</Text>
                </View>
                <View style={styles.teamItem}>
                    <Text style={styles.teamItemPoint}>{stats.steal}</Text>
                    <Text style={styles.teamItemTitle}>{'抢断'}</Text>
                    <Text style={styles.teamItemRank}>{`联盟第${statsRank.steal}`}</Text>
                </View>
                <View style={styles.teamItem}>
                    <Text style={styles.teamItemPoint}>{stats.oppPoint}</Text>
                    <Text style={styles.teamItemTitle}>{'失分'}</Text>
                    <Text style={styles.teamItemRank}>{`联盟第${statsRank.oppPoint}`}</Text>
                </View>
            </View>
        )
    };

    renderPlayer = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this.goPlayerDetail()} activeOpacity={1} key={index}>
                <View style={styles.playerItem}>
                    <Image style={styles.icon} source={{uri: item.icon}}/>
                    <View style={{flex: 1, paddingLeft: 15}}>
                        <Text style={{color: CommonStyle.THEME}}>{item.cnName}</Text>
                        <Text style={styles.jerseyNum}>{item.enName}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Text>{item.position}</Text>
                        <Text style={styles.jerseyNum}>{`#${item.jerseyNum}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    goBack = () => {
        getNavigator().pop();
    };

    goPlayerDetail = () => {
        getNavigator().push({
            name: 'PlayerDetail'
        })
    };

    getTeamInfo = () => {
        let that = this;
        let url = `http://sportsnba.qq.com/team/info?teamId=${this.state.teamId}&selects=baseInfo&appver=
        4.0.1&appvid=4.0.1&deviceId=09385DB300E081E142ED046B568B2E48&from=app&guid=
        09385DB300E081E142ED046B568B2E48&height=1920&network=WIFI&os=Android&osvid=7.1.1&width=1080`;
        NetUtil.get(url, function (res) {
            that.setState({
                baseInfo: res.data.baseInfo,
                rankInfo: res.data.rankInfo,
                stats: res.data.stats,
                statsRank: res.data.statsRank
            })
        })
    };

    getTeamPlayer = () => {
        for (let index in PlayerData) {
            if (PlayerData[index].teamId === this.state.teamId) {
                this.state.players.push(PlayerData[index])
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CommonStyle.BACKGROUND_COLOR
    },
    outline: {
        height: 100,
        width: CommonUtil.getScreenWidth(),
        flexDirection: 'row',
        backgroundColor: CommonStyle.THEME,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    teamLogo: {
        height: 60,
        width: 60
    },
    outlineTxt: {
        color: CommonStyle.WHITE,
    },
    outlineTxtSize: {
        fontSize: 14
    },
    subTitle: {
        height: 40,
        width: CommonUtil.getScreenWidth(),
        borderBottomWidth: 1,
        borderBottomColor: CommonStyle.GRAY_COLOR,
        borderTopWidth: 1,
        borderTopColor: CommonStyle.GRAY_COLOR,
        justifyContent: 'center',
        paddingLeft: 15
    },
    subTitleTxt: {
        color: CommonStyle.TEXT_GRAY_COLOR,
    },
    subContent: {
        color: CommonStyle.BLACK,
        width: CommonUtil.getScreenWidth(),
        paddingHorizontal: 15,
        lineHeight: 20,
        paddingVertical: 10
    },
    teamData: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    teamItem: {
        height: CommonUtil.getScreenWidth()/4,
        width: CommonUtil.getScreenWidth()/3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    teamItemTitle: {
        fontSize: 14,
        color: CommonStyle.TEXT_COLOR,
        marginVertical: 4
    },
    teamItemPoint: {
        fontSize: 20,
        color: CommonStyle.BLACK,
        fontWeight: 'bold',
        marginVertical: 4
    },
    teamItemRank: {
        fontSize: 14,
        color: CommonStyle.TEXT_GRAY_COLOR,
    },
    playerItem: {
        height: 80,
        width: CommonUtil.getScreenWidth(),
        flexDirection: 'row',
        borderBottomColor: CommonStyle.GRAY_COLOR,
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 15
    },
    icon: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    jerseyNum: {
        color: CommonStyle.TEXT_GRAY_COLOR,
        paddingTop: 6
    }

});

export default TeamDetail;