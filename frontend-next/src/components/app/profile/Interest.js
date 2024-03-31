// Interests for Profile
// Making this its own file since we could do a bit more with this in the future
export function Interest({ interest }) {
  return (
    <div>
      <div className="rounded-lg m-2 p-2 shadow-xl">{interest}</div>
    </div>
  );
}
