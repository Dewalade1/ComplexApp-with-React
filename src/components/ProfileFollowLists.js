import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { Link, useParams } from "react-router-dom";

import LoadingIcon from "./LoadingIcon";
import DispatchContext from "../DispatchContext";
import NetworkError from "./NetworkError";

function ProfileFollowLists(props) {
  const { username } = useParams();
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    isLoading: true,
    followList: [],
  });

  useEffect(() => {
    const request = Axios.CancelToken.source();
    const fetchFollowLists = async function () {
      if (props.type == "followers" || props.type == "following") {
        try {
          const response = await Axios.get(`/profile/${username}/${props.type}`, { cancelToken: request.token });
          setState((draft) => {
            draft.followList = response.data;
            draft.isLoading = false;
          });
        } catch (e) {
            if (e != "Cancel") {
              setState((draft) => {
                draft.isLoading = false;
              });

              appDispatch({ type: "flashMessage", value: ["alert-danger", `Couldn't fetch ${username}'s ${props.type} list. Please check your network connection`] });
              return <NetworkError />;
            }
        }
      }
    };

    fetchFollowLists();
    return () => request.cancel();
  }, [username, state.followList]);

  if (state.isLoading) return <LoadingIcon />;
  return (
    <div className="list-group">
      {state.followList.map((followListMember, index) => {
        return (
          <Link key={index} to={`/profile/${followListMember.username}`} className="list-group-item list-group-item-action list-group-item-info">
            <img className="avatar-tiny" src={followListMember.avatar} alt={`${followListMember.username}'s avatar`} /> {followListMember.username}
          </Link>
        );
      })}
      {!Boolean(state.followList.length) && (
        <div className="alert alert-light text-center shadow-sm">
          <i className="mb-3 far fa-frown fa-9x"></i>
          <p>
            This is a surprise, {username} has noone on their {props.type} list.
          </p>
          <p>
            Maybe you could be {username}'s first {props.type}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfileFollowLists;
