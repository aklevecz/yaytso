export default function EggLoader({ centered }: { centered: boolean }) {
  return (
    <div className={`egg-loader ${centered && "centered"}`}>
      <svg version="1.1" x="0px" y="0px" viewBox="0 0 74.3 69.2">
        <g id="Layer_2_1_">
          <g id="INIT">
            <g id="NAV">
              <g>
                <g id="EGG-LOADER">
                  <path
                    className="st0"
                    d="M52.4,40.4c0,8.4-6.8,15.2-15.2,15.2c-8.4,0-15.2-6.8-15.2-15.2c0,0,0,0,0,0c0-8.4,6.8-26.8,15.2-26.8
						S52.4,32,52.4,40.4z"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
