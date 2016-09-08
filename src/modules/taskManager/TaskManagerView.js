import * as TaskManagerState from './TaskManagerState';
import * as NavigationState from '../../modules/navigation/NavigationState';
import React, {PropTypes} from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View
} from 'react-native';
import styles from '../../styles';

const CounterView = React.createClass({
  propTypes: {
    counter: PropTypes.number.isRequired,
    userName: PropTypes.string,
    userProfilePhoto: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  navToForm() {
    this.props.dispatch(NavigationState.pushRoute({
      key: 'NewTask',
      title: 'Create a new task'
    }));
  },
  post() {
    this.props.dispatch(TaskManagerState.post());
  },

  renderUserInfo() {
    if (!this.props.userName) {
      return null;
    }

    return (
      <View style={styles.userContainer}>
        <Image
          style={styles.userProfilePhoto}
          source={{
            uri: this.props.userProfilePhoto,
            width: 80,
            height: 80
          }}
        />
        <Text style={styles.linkButton}>
          Welcome, {this.props.userName}!
        </Text>
      </View>
    );
  },
  render() {
    const loadingStyle = this.props.loading
      ? {backgroundColor: '#eee'}
      : null;

    return (
      <View style={styles.container}>

        {this.renderUserInfo()}

        <TouchableOpacity onPress={this.navToForm} accessible={true} style={styles.button}>
          <Text style={styles.linkButton}>
            Create a task
          </Text>
        </TouchableOpacity>

        <Text style={styles.coinText}>
          Coins left:
        </Text>

        <TouchableOpacity
          onPress={this.increment}
          style={[styles.counterButton, loadingStyle]}>
          <Text style={styles.counter}>
            {this.props.counter}
          </Text>
        </TouchableOpacity>

      </View>
    );
  }
});

export default CounterView;
