import React from "react";
import { StyleSheet, Text, View, Image, Animated, PanResponder } from "react-native";

import picture from "./assets/picture.jpg";

const findHover = (layout, { pageX, pageY }) => {
  const [selected] =
    Object.entries(layout).find(([key, value]) => {
      return (
        value.pageX <= pageX &&
        value.pageY <= pageY &&
        value.pageX + value.width >= pageX &&
        value.pageY + value.height >= pageY
      );
    }) || [];

  return selected;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: undefined,
      visible: new Animated.Value(0),
    };

    this.layout = {};

    this.likeRef = React.createRef();
    this.shareRef = React.createRef();
    this.commentRef = React.createRef();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        Animated.spring(this.state.visible, {
          toValue: 1,
          friction: 5,
        }).start();
      },
      onPanResponderMove: (e, gestureState) => {
        const { pageX, pageY } = e.nativeEvent;
        const foundValue = findHover(this.layout, { pageX, pageY });

        this.setState(state => {
          if (state.selected === foundValue) return null;
          return {
            selected: foundValue,
          };
        });
      },
      onPanResponderRelease: (e, gestureState) => {
        Animated.timing(this.state.visible, {
          toValue: 0,
          duration: 200,
        }).start(() => {
          if (this.state.selected) {
            alert(`You released on ${this.state.selected}!`);
          }
          this.setState({
            selected: undefined,
          });
        });
      },
    });
  }

  handleMeasure = (key, ref) => () => {
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      this.layout[key] = { x, y, width, height, pageX, pageY };
    });
  };
  render() {
    const modalStyle = {
      opacity: this.state.visible,
    };

    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Image
            source={picture}
            resizeMode="contain"
            style={styles.thumbnail}
            {...this._panResponder.panHandlers}
          />
        </View>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.modal, modalStyle]}
          pointerEvents="none"
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text>Jason Brown</Text>
            </View>
            <Image source={picture} style={styles.image} resizeMode="cover" />
            <View style={styles.footer}>
              <View style={styles.footerContent}>
                <Text
                  style={[styles.text, this.state.selected === "like" && styles.bold]}
                  ref={this.likeRef}
                  onLayout={this.handleMeasure("like", this.likeRef)}
                >
                  Like
                </Text>
                <Text
                  style={[styles.text, this.state.selected === "comment" && styles.bold]}
                  ref={this.commentRef}
                  onLayout={this.handleMeasure("comment", this.commentRef)}
                >
                  Comment
                </Text>
                <Text
                  style={[styles.text, this.state.selected === "share" && styles.bold]}
                  ref={this.shareRef}
                  onLayout={this.handleMeasure("share", this.shareRef)}
                >
                  Share
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "90%",
    height: "60%",
  },
  header: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: "hidden",
    padding: 8,
  },
  footer: {
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    overflow: "hidden",
    padding: 8,
  },
  footerContent: {
    justifyContent: "space-around",
    flexDirection: "row",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
});
