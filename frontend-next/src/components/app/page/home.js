import { Geo } from "../map/geo";

/**
 * Module for Welcome Message on main tab landing page
 * @prop {JSON} user - User Object
 * @returns {Object} - Welcome Message Component
 */
 function WelcomeMessage({ user }) {
  return (
    <div className="bg-white rounded-lg m-2 mt-4 text-left p-2 pl-5">
      <div>
        Welcome, {user.firstName} {user.lastName} ({user.username})
      </div>
      <div>Lets see what&apos;s happening in your area.</div>
    </div>
  );
}

/**
 * Primary App Landing Page
 * @prop {JSON} loc - Location Object {latitude, longitude}
 * @prop {Markers[]} markers - Array of Markers
 * @prop {JSON} user - User Object
 * @returns {Object} - Home Page Component
 */
export function HomePage({ loc, markers, user }) {
  return (
    <>
      <WelcomeMessage user={user} />
      <div className="h-[calc(100%-110px)] m-5 rounded-lg">
        <Geo
          loc={loc}
          zoom={14}
          movable={true}
          locMarker={true}
          markers={markers}
        />
      </div>
    </>
  );
}
