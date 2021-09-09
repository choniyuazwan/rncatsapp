/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ScrollView,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { NativeBaseProvider, Container, Header, Content, Accordion, Center, Box } from 'native-base';
import axios from 'axios';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] = 'DEMO-API-KEY';

function AccordionComponent(props) {
  return (
      <Box m={3}>
        <Accordion>
          {
            props.cats.map((cat) => (
                <Accordion.Item>
                  <Accordion.Summary>
                    {cat.name}
                    <Accordion.Icon />
                  </Accordion.Summary>
                  <Accordion.Details>
                    <Text>Country : {cat.origin}</Text>
                    {cat.description}
                    <Text>Temprament : {cat.temperament}</Text>
                  </Accordion.Details>
                </Accordion.Item>
            ))
          }
        </Accordion>
      </Box>
  );
}

const App: () => Node = () => {

  const [state, setState] = useState({
    isLoading: true,
    cats: [],
    page: 0,
    limit: 10,
    search: '',
    isMax: false,
    isLoadingLoad: false,
  });

  useEffect(() => loadData(), []);

  const loadData = () => {
    const { limit, page, cats } = state;
    const url = `/breeds?limit=${limit}&page=${page}`;
    axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          let result = res.data;
          setTimeout(() => {
            setState({
              cats: cats.concat(result),
              page: page + 1,
              isMax: result.length === 0,
              isLoading: false,
              isLoadingLoad: false,
            });
          }, 1000)
        })
        .catch((error) => {
          console.error(error);
        });
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <ScrollView>
          <AccordionComponent cats={state.cats} />
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  );
};

export default App;
