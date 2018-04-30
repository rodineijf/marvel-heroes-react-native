import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { MarvelService } from "../services/MarvelService";
import { myConstants } from "../utils/Utils";

export default class HeroDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.hero.name,
    headerStyle: { backgroundColor: myConstants.colors.redMarvel },
    headerTitleStyle: {
      color: myConstants.colors.white
    },
    headerBackTitleStyle: {
      color: myConstants.colors.white
    }
  });

  constructor(props) {
    super(props);

    this.state = {
      comics: [],
      hero: {},
      isLoadingComics: false
    };
  }

  componentWillMount() {
    const { hero } = this.props.navigation.state.params;
    this.hero = hero;
    this.setState({ hero: hero });
    this.loadComics();
  }

  loadComics() {
    this.setState({
      isLoadingComics: true
    });

    const { comics } = this.hero;

    const sources = comics.items.map(comic =>
      MarvelService.fetchResource(comic.resourceURI)
    );

    Promise.all(sources).then(comics => {
      const normalizedComics = comics.map(comic => {
        const { thumbnail } = comic.data.results[0];
        return {
          id: comic.data.results[0].id,
          title: comic.data.results[0].title,
          thumbnail: `${thumbnail.path}.${thumbnail.extension}`
        };
      });

      this.setState({ comics: normalizedComics, isLoadingComics: false });
    });
  }

  render() {
    return (
      <ImageBackground
        style={{
          backgroundColor: myConstants.colors.black,
          width: "100%",
          height: "100%"
        }}
        imageStyle={{ resizeMode: "cover" }}
        source={require("../../assets/background.png")}
      >
        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={[{ flex: 1 }, styles.label]}>
              {this.state.hero.name}
            </Text>
            <View
              style={{
                alignItems: "center",
                flex: 1
              }}
            >
              <Image
                borderRadius={50}
                source={{
                  width: 100,
                  height: 100,
                  uri: `${this.state.hero.thumbnail.path}.${
                    this.state.hero.thumbnail.extension
                  }`
                }}
              />
            </View>
          </View>
          {this.state.hero.comics.items.length === 0 ? (
            <Text style={[styles.label, { marginTop: 16 }]}>
              This character hasn't appeared on any comics
            </Text>
          ) : (
            <Text style={[styles.label, { marginTop: 16 }]}>
              Appeared in this comics
            </Text>
          )}

          {this.state.isLoadingComics === true ? (
            <ActivityIndicator size="large" style={{ marginTop: 16 }} />
          ) : null}

          <View style={styles.comicsContainer}>
            {this.state.comics.map(comic => {
              return (
                <View
                  key={comic.id}
                  style={{
                    alignItems: "center",
                    marginTop: 8,
                    width: 160
                  }}
                >
                  <Image
                    style={{
                      height: 200,
                      width: 131.52
                    }}
                    source={{
                      uri: comic.thumbnail
                    }}
                  />
                  <Text style={styles.label}>{comic.title}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  comicsContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16
  },
  label: {
    color: myConstants.colors.white,
    textAlign: "center"
  }
});
