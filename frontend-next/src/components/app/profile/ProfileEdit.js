import { useForm, Form } from "react-hook-form";
import { database, storage } from "../../../../firebase-config";
import { ref as sRef, getDownloadURL } from "firebase/storage";
import { ref, update } from "firebase/database";
import { uploadBytes } from "firebase/storage";

export function ProfileEdit({ profileData, user, onSave }) {
  var { register, control } = useForm();

  const handleEditState = () => {
    onSave(false);
  };

  // Handles clicking save button
  function save({ data }) {

    // Profile pic handling
    if (data.pfp[0]) {
      // image stuff
      uploadBytes(sRef(storage, `users/${user.uid}/pfp`), data.pfp[0]).then(
        () => {
          getDownloadURL(sRef(storage, `users/${user.uid}/pfp`)).then((url) => {
            data.pfp = url;
            for (var key in data) {
              if (data[key] == "") {
                data[key] = profileData[key];
              }
            }

            handleEditState(false);
            update(ref(database, `users/${user.uid}`), data);
          });
        }
      );
    } else {
      for (var key in data) {
        if (data[key] == "") {
          data[key] = profileData[key];
        }
      }
      data.pfp = profileData.pfp;
      handleEditState(false);
      update(ref(database, `users/${user.uid}`), data);
    }
  }

  return (
    <div>
      <Form onSubmit={save} encType={"application/json"} control={control}>
        <div className="grid grid-cols-2">
          <div>
            <img
              src={profileData.pfp}
              width="150px"
              className="relative mx-auto rounded-2xl overflow-hidden"
            />
            Current Profile Picture
          </div>
          <div className="flex content-center">
            <input
              type="file"
              {...register("pfp")}
              className="w-[80%]"
              accept=".jpg,.png,.jpeg"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 pl-2 w-[90%]">
          <div className="pt-5">
            <div className="font-bold">First Name</div>
            <input
              className="w-[80%] border-2 border-gray-300 p-2 rounded-lg"
              type="text"
              {...register("firstName")}
              placeholder={profileData.firstName}
            />
          </div>
          <div className="pt-5">
            <div className="font-bold">Last Name</div>
            <input
              className="w-[80%] border-2 border-gray-300 p-2 rounded-lg"
              type="text"
              {...register("lastName")}
              placeholder={profileData.lastName}
            />
          </div>
          <div className="pt-5">
            <div className="font-bold">Username</div>
            <input
              className="w-[80%] border-2 border-gray-300 p-2 rounded-lg"
              type="text"
              {...register("username")}
              placeholder={profileData.username}
            />
          </div>
          <div className="pt-5">
            <div className="font-bold">Interests (Comma Seperated)</div>
            <input
              className="w-[80%] border-2 border-gray-300 p-2 rounded-lg"
              type="text"
              {...register("interests")}
              placeholder={profileData.interests}
            />
          </div>
          <div className="pt-5 col-span-2">
            <div className="font-bold">Bio</div>
            <textarea
              className="w-[92%] border-2 border-gray-300 p-2 rounded-lg"
              {...register("bio")}
              type="text"
              placeholder={profileData.bio}
            />
          </div>
          <div className="justify-items-center pt-5 col-span-2">
            <button
              type="submit"
              className="p-2 cursor-pointer bg-cyan-500 text-white font-bold rounded-full text-center"
            >
              {" "}
              Save Changes{" "}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
