import PropTypes from "prop-types";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { myConstants } from "../utils/Utils";

export class HeroItemComponent extends React.Component {
  static propTypes = {
    imageUri: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func
  };

  render() {
    return (
      <TouchableOpacity
        style={{
          alignContent: "flex-start",
          alignItems: "center",
          borderBottomColor: myConstants.colors.white,
          borderBottomWidth: 1,
          flexDirection: "row"
        }}
        onPress={this.props.onPress}
      >
        <Image
          borderRadius={25}
          source={{
            uri: this.props.imageUri
          }}
          style={{
            height: 50,
            marginVertical: 8,
            width: 50
          }}
        />
        <Text
          style={{
            color: myConstants.colors.white,
            fontWeight: "bold",
            marginLeft: 12
          }}
        >
          {this.props.name}
        </Text>
      </TouchableOpacity>
    );
  }
}
