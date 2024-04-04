import { Map, Marker, ZoomControl } from "pigeon-maps";

/**
 * Geo Component for Wrapping Map
 * @constructor
 * @prop {JSON} loc - Location Object {latitude, longitude}
 * @prop {Number} zoom - Zoom Level
 * @prop {Boolean} locMarker - Show Location Marker
 * @prop {Markers[]} markers - Array of Markers
 * @returns {Map} - Geo Component (As Map)
 */
export function Geo({ loc, zoom, locMarker, markers }) {
  if (loc) {
    return (
      <Map center={[loc.latitude, loc.longitude]} defaultZoom={zoom}>
        {markers && markers}
        {locMarker && (
          <Marker
            width={30}
            anchor={[loc.latitude, loc.longitude]}
            color="red"
          />
        )}
        {zoom && <ZoomControl />}
      </Map>
    );
  } else {
    return (
      <Map className="rounded-lg" defaultCenter={[0, 0]} defaultZoom={zoom} />
    );
  }
}
