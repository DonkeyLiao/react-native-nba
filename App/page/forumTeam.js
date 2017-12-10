/**
 * Created by Cral-Gates on 2017/11/14.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import HeaderBar from '../components/headerBar';
import CommunityItem from '../components/communityItem';
import NetUtil from '../util/netUtil';
import CommonStyle from '../style/commonStyle';
import CommonUtil from '../util/commonUtil';
import {getNavigator} from '../constant/router';
import Global from '../constant/global';


class ForumTeam extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.team);
        this.state = {
            dataSource: [],
            isRefreshing: false,
            page: 1,
            pageSize: 30,
            mid: this.props.team.id,
            title: this.props.team.name
        }
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(this.getTeamList());
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderBar
                    title={this.state.title+'社区'}
                    showLeftState={true}
                    showRightState={false}
                    leftItemTitle={''}
                    onPress={() => this.goBack()}/>
                <FlatList
                    data={this.state.dataSource}
                    dataExtra={this.state}
                    renderItem={(item) => this._renderItemView(item)}
                    onEndReached={() => this.onLoadMore()}
                    onRefresh={() => this.getTeamList()}
                    onEndReachedThreshold={0.2}
                    initialNumToRender={10}
                    getItemLayout={(item, index) => this._getItemLayout(item, index)}
                    keyExtractor={(item) => this._keyExtractor(item)}
                    refreshing={this.state.isRefreshing}/>
            </View>
        )
    }

    _renderItemView = (item) => {
        let that = this;
        return (
            <CommunityItem
                item={item}
                _onPress={(item) => this.goCommunityDetail(item)}/>

        )
    };

    _keyExtractor = (item, index) => item.id;

    _getItemLayout = (item, index) => (
        {length: 108, offset: 108 * index, index}
    );

    getTeamList = () => {
        let that = this;
        that.setState({
            isRefreshing: true,
            page: 1
        });
        let url = 'http://shequweb.sports.qq.com/module/filterTopics?mid='+ this.state.mid +'&page='+ this.state.page +
            '&count=' + this.state.pageSize +'&period=all&order=&elite=0&activity=0';
        NetUtil.get(url, function (res) {
            console.log(res.data.list);
            that.setState({
                dataSource: res.data.list,
                isRefreshing: false
            })
        })
    };

    onLoadMore = () => {
        let that = this;
        that.setState({
            isRefreshing: true,
        });
        console.log(this.state.page);
        let url = 'http://shequweb.sports.qq.com/module/filterTopics?mid='+ this.state.mid +'&page='+ this.state.page++ +
            '&count=' + this.state.pageSize +'&period=all&order=&elite=0&activity=0';
        NetUtil.get(url, function (res) {
            that.setState({
                dataSource: that.state.dataSource.concat(res.data.list),
                isRefreshing: false
            })
        })
    };

    goBack = () => {
        getNavigator().pop();
    };

    goCommunityDetail = (item) => {
        getNavigator().push({
            name: 'CommunityDetail',
            id: item.item.id
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default ForumTeam;