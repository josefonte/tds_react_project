import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  useColorScheme,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import {AuthContext} from '../navigation/AuthContext';
import {darkModeTheme, lightModeTheme} from '../utils/themes';

export default function Profile() {
  const {logout} = React.useContext(AuthContext);

  const theme = useColorScheme() === 'dark' ? darkModeTheme : lightModeTheme;
  const navigation = useNavigation();

  const backgroundColor = theme.background_color;
  const titleColor = theme.text;
  const textColor = theme.text2;
  const colorDiviver = theme.color8;
  const redButtonPressed = theme.redButton;
  const redtitle = theme.redtitle;

  const onPressLeave = () => {
    logout();
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.content}>
        <View>
          <Text style={[styles.username, {color: titleColor}]}>
            NOME DO USER
          </Text>
          <View style={[styles.stats, {borderColor: colorDiviver}]}>
            <View style={styles.stats_cont}>
              <Text style={[styles.stats_num, {color: textColor}]}>1</Text>
              <Text style={[styles.stats_desc, {color: textColor}]}>
                Feitos
              </Text>
            </View>

            <View
              style={{
                height: '100%',
                borderStyle: 'solid',
                borderColor: colorDiviver,
                borderRightWidth: 1,
              }}
            />
            <View style={styles.stats_cont}>
              <Text style={[styles.stats_num, {color: textColor}]}>8</Text>
              <Text style={[styles.stats_desc, {color: textColor}]}>
                Criados
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.options}>
          <Pressable
            onPress={() => navigation.navigate('Configs')}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? colorDiviver : backgroundColor,
              },
            ]}>
            <View style={[styles.button, {borderBottomColor: colorDiviver}]}>
              <Ionicons
                name={'settings-outline'}
                size={20}
                color={textColor}
                style={{paddingHorizontal: 10}}
              />

              <Text style={{fontSize: 18, color: textColor}}>
                Configurações
              </Text>

              <Octicons
                name={'chevron-right'}
                size={22}
                color={textColor}
                style={{end: 15, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Support')}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? colorDiviver : backgroundColor,
              },
            ]}>
            <View style={[styles.button, {borderBottomColor: colorDiviver}]}>
              <Ionicons
                name={'help-buoy-outline'}
                size={20}
                color={textColor}
                style={{paddingHorizontal: 10}}
              />

              <Text style={{fontSize: 18, color: textColor}}>Apoio</Text>

              <Octicons
                name={'chevron-right'}
                size={22}
                color={textColor}
                style={{end: 15, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('About')}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? colorDiviver : backgroundColor,
              },
            ]}>
            <View style={[styles.button, {borderBottomColor: colorDiviver}]}>
              <Ionicons
                name={'information-circle-outline'}
                size={20}
                color={textColor}
                style={{paddingHorizontal: 10}}
              />

              <Text style={{fontSize: 18, color: textColor}}>Sobre a app</Text>

              <Octicons
                name={'chevron-right'}
                size={22}
                color={textColor}
                style={{end: 15, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              {
                backgroundColor: pressed ? colorDiviver : backgroundColor,
              },
            ]}>
            <View style={[styles.button, {borderBottomColor: colorDiviver}]}>
              <MaterialIcons
                name={'script-text-outline'}
                size={20}
                color={textColor}
                style={{paddingHorizontal: 10}}
              />

              <Text style={{fontSize: 18, color: textColor}}>
                Enviar Feedback
              </Text>

              <Octicons
                name={'chevron-right'}
                size={22}
                color={textColor}
                style={{end: 15, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={onPressLeave}
            style={({pressed}) => [
              {
                backgroundColor: pressed ? redButtonPressed : backgroundColor,
              },
            ]}>
            <View style={[styles.button, {borderBottomWidth: 0}]}>
              <Text style={{paddingLeft: 12, fontSize: 18, color: 'red'}}>
                Terminar Sessão
              </Text>

              <Feather
                name={'log-out'}
                size={20}
                color={'red'}
                style={{end: 8, position: 'absolute'}}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '5%',
  },

  options: {
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  username: {
    marginTop: '10%',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
  },

  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },

  stats: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
    marginHorizontal: '10%',
    paddingBottom: 10,
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },

  stats_cont: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  stats_num: {
    fontSize: 30,
    fontWeight: '600',
  },

  stats_desc: {
    fontSize: 12,
    fontWeight: '400',
  },
});
