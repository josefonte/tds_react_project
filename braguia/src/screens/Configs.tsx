import React from 'react';
import {StyleSheet, Text, View, Pressable, useColorScheme} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import {AuthContext} from '../navigation/AuthContext';
import {darkModeTheme, lightModeTheme} from '../utils/themes';
import {color} from '@rneui/themed/dist/config';

export default function Configs() {
  const {logout} = React.useContext(AuthContext);
  const navigation = useNavigation();

  const theme = useColorScheme() === 'dark' ? darkModeTheme : lightModeTheme;

  const backgroundColor = theme.background_color;
  const titleColor = theme.text;
  const textColor = theme.text2;
  const colorDiviver = theme.color8;

  const onPressLeave = () => {
    logout();
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.content}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'flex-start',
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: colorDiviver,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Octicons
                name={'chevron-left'}
                size={22}
                color={textColor}
                style={{paddingRight: 3}}
              />
            </View>
          </Pressable>
          <View style={[styles.pageTitleContainer, {borderColor: titleColor}]}>
            <Ionicons
              name={'settings-outline'}
              size={17}
              color={titleColor}
              style={{paddingRight: 5}}
            />

            <Text style={[styles.pageTitle, {color: titleColor}]}>
              Configurações
            </Text>
          </View>
        </View>

        <View style={styles.options}>
          <Pressable>
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
                style={{end: 10, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable>
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
                style={{end: 10, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable>
            <View style={[styles.button, {borderBottomColor: colorDiviver}]}>
              <Ionicons
                name={'information-circle-outline'}
                size={20}
                color={textColor}
                style={{paddingHorizontal: 10}}
              />
              <Pressable>
                <Text style={{fontSize: 18, color: textColor}}>
                  Sobre a app
                </Text>
              </Pressable>

              <Octicons
                name={'chevron-right'}
                size={22}
                color={textColor}
                style={{end: 10, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable>
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
                style={{end: 10, position: 'absolute'}}
              />
            </View>
          </Pressable>

          <Pressable onPress={onPressLeave}>
            <View style={[styles.button, {borderBottomWidth: 0}]}>
              <Text style={{paddingLeft: 15, fontSize: 18, color: textColor}}>
                Terminar Sessão
              </Text>

              <Feather
                name={'log-out'}
                size={20}
                color={textColor}
                style={{end: 3, position: 'absolute'}}
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

  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    width: '85%',
    marginLeft: 15,
  },
  pageTitle: {
    fontSize: 18,

    borderBottomWidth: 1,
    borderStyle: 'solid',
  },

  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
});
