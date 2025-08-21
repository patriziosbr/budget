import React, { useRef } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';

const userNameColor = [];

function RandomColorCircle({ letter = "X", tooltip = "", email = null,  className, ...props }) {

  const [showTooltip, setShowTooltip] = React.useState(false);
  const targetRef = useRef(null);
  
  const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Use hash to generate HSL values for matte color
  const hue = Math.abs(hash) % 360;
  const saturation = 45; // matte: low saturation
  const lightness = 45;  // matte: mid-low lightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

  // Generate a random color on component mount
  // const randomColor = React.useMemo(() => {
  //   return '#' + Math.floor(Math.random()*16777215).toString(16);
  // }, []);
  
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
  
  const textColor = getContrastColor(stringToColor(email));

  return (
    <>
      <div 
        ref={targetRef}
        className={`text-capitalize circle ${className || ''}`}
        style={{ 
          position: "relative",
          backgroundColor: stringToColor(email),
          color: textColor,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...props}
      >
        {(() => {
          switch (className) {
            case "circle-small":
              return (
                <p
                  className='text-bold mb-0 w-100 h-100'
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "13px"
                  }}
                >
                  {Array.isArray(letter) ? letter.join('') : letter[0]}
                </p>
              );
            case "circle-large":
              return (
                <p
                  className='text-bold mb-0 w-100 h-100'
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "50px"
                  }}
                >
                  {Array.isArray(letter) ? letter.join('') : letter[0]}
                </p>
              );
            default:
              return (
                <p
                  className='text-bold mb-0 w-100 h-100'
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "14px"
                  }}
                >
                  {Array.isArray(letter) ? letter.join('') : letter[0]}
                </p>
              );
          }
        })()}
      </div>
      
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