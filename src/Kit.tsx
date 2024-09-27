import {playHiHat} from './samples/hihat.ts';
import {playSnare} from './samples/snare.ts';
import {playKick} from './samples/kick.ts';
import {playCrashCymbal} from './samples/crash.ts';

const buttonWidth = '49%';
const buttonHeight = '99%';

const buttonStyle = {
  width: buttonWidth,
  height: buttonHeight,
  color: 'white',
  border: 'none',
  borderRadius: '0',
}

export const Kit = () => {
  return <div style={{
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }}>
    <div style={{
      display: 'flex',
      width: '100%',
      height: '50vh',
      flexDirection: 'row',
    }}>
      <button style={{...buttonStyle, backgroundColor: '#FDA341'}} onClick={() => playHiHat()}>HiHat</button>
      <button style={{...buttonStyle, backgroundColor: '#FE5156'}} onClick={() => playSnare()}>Snare</button>
    </div>

    <div style={{
      display: 'flex',
      width: '100%',
      height: '50vh',
      flexDirection: 'row',
    }}>
      <button style={{...buttonStyle, backgroundColor: '#0BDAFE'}} onClick={() => playKick()}>Kick</button>
      <button style={{...buttonStyle, backgroundColor: '#C56BFE'}} onClick={() => playCrashCymbal()}>Crash</button>
    </div>

  </div>
}
