import "./MeasurementViewer.css";
import mannequin from "../../assets/manequin.webp";

function MeasurementViewer({ measurement }) {
  return (
    <div className="viewer">

      <div className="viewer-wrapper">

        <img
          src={mannequin}
          alt="Mannequin"
          className="mannequin"
        />

        <svg
          className="overlay"
          viewBox="0 0 500 700"
        >

          {/* Neck */}

<line
    x1="250"
    y1="100"
    x2="340"
    y2="90"
    className="measure-line"
/>

<circle
    cx="250"
    cy="100"
    r="4"
    className="dot"
/>

<rect
    x="340"
    y="63"
    width="110"
    height="34"
    rx="18"
    className="label-box"
/>

<text
    x="395"
    y="85"
    className="label-text"
>
    Neck : {measurement.neck || "-"}
</text>

          {/* Shoulder */}

          <line x1="170" y1="120"
                x2="60" y2="120"
                className="measure-line"/>

          <circle cx="170" cy="120"
                  r="4"
                  className="dot"/>

          <rect x="15"
                y="103"
                width="120"
                height="34"
                rx="18"
                className="label-box"/>

          <text
            x="70"
            y="125"
            className="label-text"
          >
            Shoulder : {measurement.shoulder || "-"}
          </text>

{/* Sleeve */}

<line
    x1="185"
    y1="250"
    x2="60"
    y2="250"
    className="measure-line"
/>

<circle
    cx="185"
    cy="250"
    r="4"
    className="dot"
/>

<rect
    x="20"
    y="233"
    width="120"
    height="34"
    rx="18"
    className="label-box"
/>

<text
    x="70"
    y="255"
    className="label-text"
>
    Sleeve : {measurement.sleeve || "-"}
</text>


          {/* Bust */}

          <line x1="300"
                y1="170"
                x2="430"
                y2="170"
                className="measure-line"/>

          <circle cx="300"
                  cy="170"
                  r="4"
                  className="dot"/>

          <rect x="380"
                y="150"
                width="100"
                height="34"
                rx="18"
                className="label-box"/>

          <text
            x="430"
            y="170"
            className="label-text"
          >
            Bust : {measurement.bust || "-"}
          </text>


          {/* Waist */}

          <line x1="285"
                y1="240"
                x2="430"
                y2="245"
                className="measure-line"/>

          <circle cx="285"
                  cy="240"
                  r="4"
                  className="dot"/>

          <rect x="390"
                y="230"
                width="110"
                height="34"
                rx="18"
                className="label-box"/>

          <text
            x="445"
            y="250"
            className="label-text"
          >
            Waist : {measurement.waist || "-"}
          </text>


        {/* Hip */}

<line
    x1="300"
    y1="265"
    x2="430"
    y2="345"
    className="measure-line"
/>

<circle
    cx="300"
    cy="265"
    r="4"
    className="dot"
/>

<rect
    x="380"
    y="328"
    width="95"
    height="34"
    rx="18"
    className="label-box"
/>

<text
    x="428"
    y="350"
    className="label-text"
>
    Hip : {measurement.hip || "-"}
</text>


          

        </svg>

      </div>

    </div>
  );
}

export default MeasurementViewer;