import { Map, Marker, ZoomControl } from "pigeon-maps";


// Map module for main page and chat room sidebar (and eventually user profile)
// Constructs Map and Markers
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