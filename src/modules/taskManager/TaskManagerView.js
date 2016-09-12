import React, {PropTypes} from 'react';
import _ from 'underscore';
import * as TaskManagerState from './TaskManagerState';
import * as NavigationState from '../../modules/navigation/NavigationState';
import {
  TouchableOpacity,
  Text,
  View,
  ListView,
  ActivityIndicator
} from 'react-native';
import ListItemWithIcon from '../../components/ListItemWithIcon';
import styles from '../../styles';

const TaskManagerView = React.createClass({
  propTypes: {
    assignedTasks: PropTypes.array,
    user: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  },
  componentDidMount() {
    this.assignedTasks();
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.assignedTasks !== this.props.assignedTasks) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._getListViewData(nextProps.assignedTasks))
      });
    }
  },
  _getListViewData(tasks) { // swap this out for halpers function later
    const dispatch = this.props.dispatch;
    return tasks.map((item) => _.extend(
      item.task.properties,
      {
        taskId: item.task._id, // taskId isn't included in properties
        dispatch
      }
    ));
  },
  assignedTasks() {
    this.props.dispatch(TaskManagerState.assignedTasks());
  },
  navToForm() {
    this.props.dispatch(NavigationState.pushRoute({
      key: 'NewTask',
      title: 'Create a new task'
    }));
  },
  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color='#FF4081' style={styles.loadCircle}/>
        <Text style={styles.loadText}>Loading Tasks...</Text>
      </View>
    );
  },
  renderListView() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress={this.navToForm} accessible={true} style={styles.button}>
          <Text style={styles.buttonText}>
            Create a task
          </Text>
        </TouchableOpacity>

        <Text style={styles.coinText}>
          Coins left: {this.props.user.coins}
        </Text>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={ListItemWithIcon}
        />

      </View>
    );
  },
  render() {
    return this.props.loading
      ? this.renderLoadingView()
      : this.renderListView();
  }
});

export default TaskManagerView;
