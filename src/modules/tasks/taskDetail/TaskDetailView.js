import React, {PropTypes} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import styles from '../../../styles';
import colors from '../../../styles/colors';
import * as TaskStateActions from '../TaskState';
import * as NavigationStateActions from '../../navigation/NavigationState';
import RatingFormModalViewContainer from '../../taskManager/ratingForm/RatingFormModalViewContainer';

const typeIcons = {
  domestic: require('../../../styles/icons/domestic.png'),
  errands: require('../../../styles/icons/errands.png'),
  handyman: require('../../../styles/icons/handyman.png'),
  informative: require('../../../styles/icons/informative.png'),
  miscellaneous: require('../../../styles/icons/miscellaneous.png'),
  physical_labor: require('../../../styles/icons/physical_labor.png')
};

const TaskDetailView = React.createClass({
  propTypes: {
    userId: PropTypes.number,
    task: PropTypes.object,
    loading: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
    return {};
  },
  assignTask() {
    const assignment = {
      taskId: this.props.task.taskId,
      userId: this.props.userId
    };
    // if not logged in to the app, redirect to profile page to sign up
    if (!this.props.userId) {
      this.props.dispatch(NavigationStateActions.switchTab(0));
    }
    this.props.dispatch(TaskStateActions.assignTask(assignment));
    this.props.dispatch(NavigationStateActions.popRoute());
  },
  completeTask() {
    console.log('isRequestor', this.userIsRequestor());
    // if user is assignee && taks is not confirmed complete by requestor
    if (!this.props.task.requestorCompleted && !this.userIsRequestor) {
      console.log('requestor confirm completed task');
      return;// display waiting message
    }
    // send completion post
    console.log('completeTask');
    this.props.dispatch(TaskStateActions.completeTask(
      this.props.task.taskId,
      this.userIsRequestor()
    ));

    // post task assesment modal here!
  },
  isAssigned() {
    // if assigned
    return (this.props.task.status === 'assigned');
  },
  userIsRequestor() {
    return this.props.task.userId === this.props.userId;
  },
  render() {
    return (
      <View style={styles.container}>
        <RatingFormModalViewContainer />
        <ScrollView>
          <View style={styles.container}>

            <Text style={styles.detailTitleText}>{this.props.task.taskName}</Text>
            <Text style={styles.detailTitleText}>@ Task Requestor Name</Text>
            <Text style={styles.detailTitleText}>Requestor Rating</Text>

            <View style={styles.detailSeperator} />

            <View style={styles.detailTypeSection}>
              <Image style = {styles.detailIcon}
                source={typeIcons[this.props.task.type.toLowerCase().replace(' ', '_')]}
              />
              <View style={styles.rightContainer}>
                <Text style={styles.detailTypeText}>{this.props.task.type}</Text>
                <Text style={styles.detailTypeText}>Level {this.props.task.difficulty} Difficulty</Text>
              </View>
            </View>

            <View style={styles.detailSeperator} />

            <Text style={styles.detailSubtitleText}>
              {moment(this.props.task.deadlineDate).format('MMMM Do YYYY')}
            </Text>
            <Text style={styles.detailSubtitleText}>{this.props.task.address}</Text>

            <View style={styles.detailSeperator} />

            <View style={styles.detailInfoContainer}>
              <Text style={styles.detailInfoText}>{this.props.task.desc}</Text>
            </View>

              <TouchableOpacity
                style={this.isAssigned()
                  ? Object.assign({}, styles.button, {backgroundColor: colors.primaryColor})
                  : styles.button
                }
                onPress={this.isAssigned()
                  ? this.completeTask
                  : this.assignTask
                }
              >
                <Text style={styles.buttonText}>
                  {this.isAssigned()
                  ? 'I did it!'
                  : 'I can do it!'
                }
                </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    );
  }
});

export default TaskDetailView;
