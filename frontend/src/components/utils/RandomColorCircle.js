import React, { useRef } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';

function RandomColorCircle({ letter = "X", tooltip = "", className, ...props }) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const targetRef = useRef(null);
  
  // Generate a random color on component mount
  const randomColor = React.useMemo(() => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }, []);
  
  // Calculate text color based on background color brightness
  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate perceived brightness using weighted RGB (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black for light backgrounds, white for dark
    return brightness > 128 ? '#000000' : '#ffffff';
  };
  
  const textColor = getContrastColor(randomColor);
  
  return (
    <>
      <span 
        ref={targetRef}
        className={`text-capitalize p-3 ${className || ''}`}
        style={{ 
          backgroundColor: randomColor,
          color: textColor,

        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...props}
      >
       <p className='text-bold mb-0'> {Array.isArray(letter) ? letter.join('') : letter[0]}</p>
      </span>
      
      {tooltip && (
        <Overlay target={targetRef.current} show={showTooltip} placement="top">
          {(props) => (
            <Tooltip id="circle-tooltip" {...props}>
              {tooltip}
            </Tooltip>
          )}
        </Overlay>
      )}
    </>
  );
}

export default RandomColorCircle;