import React from "react";
import useStore from "../../store";
import GridLines from 'react-gridlines';

const Background = () => {

  const store = useStore.getState();
  const { setBackgroundImg } = store;
  const backgroundImg = useStore(state => state.backgroundImg);


  const WhiteBg = () => {
    return (
      <div className="bg-white"> </div>
    )
  }

  const GridBg = () => {
    return (
      <>
        <GridLines className="h-screen w-screen" cellWidth={70} strokeWidth={1} cellWidth2={35}></GridLines>
      </>
    )
  }

  console.log(backgroundImg);

  return (
    <>
      <div className="absolute inset-0 -z-10">
        {backgroundImg === 'white' ? <WhiteBg /> : <GridBg />}

      </div>
    </>
  )
}

export default Background;