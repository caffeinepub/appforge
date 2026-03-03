import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
  type OldActor = {
    apps : Map.Map<Text, OldApp>;
  };

  type OldApp = {
    id : Text;
    name : Text;
    description : Text;
    screens : [OldAppScreen];
    icon : ?Storage.ExternalBlob;
    screenshots : [Storage.ExternalBlob];
    isPublished : Bool;
  };

  type OldAppScreen = {
    id : Text;
    title : Text;
    content : Text;
  };

  type NewActor = {
    apps : Map.Map<Text, NewApp>;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewApp = {
    id : Text;
    name : Text;
    description : Text;
    owner : Principal;
    screens : [NewAppScreen];
    icon : ?Storage.ExternalBlob;
    screenshots : [Storage.ExternalBlob];
    isPublished : Bool;
  };

  type NewAppScreen = {
    id : Text;
    title : Text;
    content : Text;
  };

  type UserProfile = {
    name : Text;
  };

  public func run(old : OldActor) : NewActor {
    let newApps = old.apps.map<Text, OldApp, NewApp>(
      func(_id, oldApp) {
        {
          oldApp with
          owner = Principal.anonymous()
        };
      }
    );

    let accessControlState = AccessControl.initState();
    let userProfiles = Map.empty<Principal, UserProfile>();

    {
      apps = newApps;
      accessControlState;
      userProfiles;
    };
  };
};
