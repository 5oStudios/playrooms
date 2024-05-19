import { down, drop, left, right, up } from '../services/claws-controls';
import './controls.css';

// const controls = [
//   {
//     keys: ['w', 'arrowup'],
//     handler: clawsControls().up,
//   },
//   {
//     keys: ['s', 'arrowdown'],
//     handler: clawsControls().down,
//   },
//   {
//     keys: ['a', 'arrowleft'],
//     handler: clawsControls().left,
//   },
//   {
//     keys: ['d', 'arrowright'],
//     handler: clawsControls().right,
//   },
// ];

export const Controls = () => {
  return (
    <div className="controls">
      <div className="control-buttons">
        <button onClick={up} className="control-button control-button--up">
          up
        </button>
        <div onClick={down} className="control-button control-button--down">
          down
        </div>
        <div onClick={left} className="control-button control-button--left">
          left
        </div>
        <div onClick={right} className="control-button control-button--right">
          right
        </div>
      </div>
      <div onClick={drop} className="control-button control-button--right">
        Drop
      </div>
    </div>
  );
};
