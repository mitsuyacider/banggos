import osc from 'react-native-osc';
import {
  NativeEventEmitter,
} from 'react-native';

const portIn = 9999;
const portOut = 8888;

export const addOscListener = (callback) => {
  // NOTE: Create a client and send a message
  osc.createClient('192.168.1.0', portOut);
  osc.sendMessage('/address/', [1.0, 0.0]);

  // NOTE: Suscribe to GotMessage event to receive OSC messages
  const eventEmitter = new NativeEventEmitter(osc);
  eventEmitter.addListener('GotMessage', (oscMessage) => {
    if (oscMessage.address === '/sexy/60') {
      callback();
    }
  });

  osc.createServer('', portIn);
}