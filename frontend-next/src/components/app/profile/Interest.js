/**
 * Interest for Profile
 * @prop {String} interest - Interest item
 * @returns {Object} - Interest Component
 */
export function Interest({ interest }) {
  return (
    <div>
      <div className="rounded-lg m-2 p-2 shadow-xl">{interest}</div>
    </div>
  );
}
