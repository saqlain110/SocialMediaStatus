import {
  View,
  Text,
  StatusBar,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import {DummyVideos} from './util';

export default function App() {
  StatusBar.setBarStyle('light-content', true);
  const {width, height} = Dimensions.get('screen');
  const [activeIndx, setActiveIdx] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [videos, setVideos] = useState([]);
  const ref = useRef();
  const videoref = useRef(null);
  const [showStatus, setShowStatus] = useState(false);
  useEffect(() => {
    // ====SETTING VIDEOS WITH RESPECT TO ACTIVE INDEX=========//
    ref?.current?.scrollToOffset({
      offset: activeIndx * width,
      animated: true,
    });
    setCurrentDuration(0);
    setDuration(videos[activeIndx]?.duration);
    console.log('useEffect called', currentDuration);
    if (videoref.current) {
      console.log('seek called', activeIndx);
      videoref.current.seek(0);
    }
  }, [activeIndx]);
  const onProgress = data => {
    setCurrentDuration(Math.floor(data.currentTime) / duration);
  };

  const [isLoading, setIsLoading] = useState(true);

  const onLoadStart = () => {
    setIsLoading(true);
  };

  const onLoad = () => {
    setIsLoading(false);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{height, width, backgroundColor: '#000'}}>
        <Video
          source={{uri: item.video_files[1].link}}
          ref={videoref}
          paused={index == activeIndx ? false : true}
          onProgress={onProgress}
          onEnd={_onEnd}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          resizeMode="cover"
          controls={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            flex: 1,
            width: '100%',
            height: '100% ',
          }}
        />
        {isLoading && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              flex: 1,
              width: '100%',
              height: '100% ',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    (() => {
      try {
        let data = DummyVideos;
        let filtered_video = data.filter(e => e?.duration < 11);
        setActiveIdx(0);
        setVideos(filtered_video);
        setDuration(filtered_video[0].duration);
      } catch (error) {
        throw error;
      }
    })();
  }, []);
  const setActiveValues = activeVal => {
    setActiveIdx(activeVal);
  };

  const _onEnd = () => {
    if (activeIndx < videos.length - 1) {
      setActiveIdx(prev => prev + 1);
    } else {
      setShowStatus(false);
    }
  };
  const moveforward = () => {
    if (activeIndx < videos.length - 1) {
      setActiveIdx(prev => prev + 1);
      setCurrentDuration(0);
    } else {
      setShowStatus(false);
      setActiveIdx(0);
    }
  };
  const moveBackward = () => {
    if (activeIndx > 0) {
      setActiveIdx(prev => prev - 1);
      setCurrentDuration(0);
    } else {
      return;
    }
  };
  return showStatus ? (
    <View style={{position: 'relative'}}>
      <FlatList
        ref={ref}
        keyExtractor={item => item.id.toString()}
        data={videos}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={ev => {
          setActiveValues(ev.nativeEvent.contentOffset.x / width);
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 25,
          width,
          marginHorizontal: 5,
        }}>
        {videos?.length > 0 ? (
          <FlatList
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{width, justifyContent: 'center'}}
            horizontal
            data={videos}
            renderItem={({_, index}) => (
              <View style={{marginHorizontal: 3, height: 30, marginTop: 10}}>
                <Progress.Bar
                  progress={
                    index == activeIndx
                      ? currentDuration
                      : activeIndx > index
                      ? 1
                      : 0
                  }
                  width={width / videos.length - 8}
                  height={4}
                  borderColor="transparent"
                  color="#eee"
                  unfilledColor="#fff6"
                />
              </View>
            )}
          />
        ) : null}
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
            top: -10,
          }}>
          <Image
            source={require('./assets/pic1.jpg')}
            style={{
              height: 40,
              width: 40,
              resizeMode: 'cover',
              borderRadius: 30,
            }}
          />
          <View style={{left: 10}}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>
              Franklin
            </Text>
            <Text style={{color: '#fff', fontSize: 14}}>5:15 AM</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          height: height,
          width,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{height, width: width / 2}}
          onPress={moveBackward}></TouchableOpacity>
        <TouchableOpacity
          style={{height, width: width / 2}}
          onPress={moveforward}></TouchableOpacity>
      </View>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
      }}>
      <Image
        source={require('./assets/pic.jpg')}
        style={{
          height: 100,
          width: 100,
          resizeMode: 'cover',
          borderRadius: 50,
          bottom: 5,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          height: 50,
          width: 150,
          backgroundColor: '#050505',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => setShowStatus(true)}>
        <Text style={{textAlign: 'center', color: '#fff', fontSize: 16}}>
          View Updates
        </Text>
      </TouchableOpacity>
    </View>
  );
}
