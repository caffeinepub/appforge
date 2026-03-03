import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import List "mo:core/List";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

// Migration from deprecated version.
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  public type App = {
    id : Text;
    name : Text;
    description : Text;
    owner : Principal;
    screens : [AppScreen];
    icon : ?Storage.ExternalBlob;
    screenshots : [Storage.ExternalBlob];
    isPublished : Bool;
  };

  public type AppScreen = {
    id : Text;
    title : Text;
    content : Text;
  };

  public type CreateAppInput = {
    name : Text;
    description : Text;
  };

  public type AddScreenInput = {
    appId : Text;
    screenId : Text;
    title : Text;
    content : Text;
  };

  public type EditScreenInput = {
    appId : Text;
    screenId : Text;
    title : Text;
    content : Text;
  };

  public type UploadIconInput = {
    appId : Text;
    icon : Storage.ExternalBlob;
  };

  public type AddScreenshotInput = {
    appId : Text;
    screenshot : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  let apps = Map.empty<Text, App>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func checkOwner(caller : Principal, app : App) {
    if (app.owner != caller) {
      Runtime.trap("Unauthorized: Only the app owner can perform this action");
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // App Management Functions
  public shared ({ caller }) func createApp(input : CreateAppInput) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let id = caller.toText() # "." # apps.size().toText();
    let newApp : App = {
      id;
      name = input.name;
      description = input.description;
      owner = caller;
      screens = [];
      icon = null;
      screenshots = [];
      isPublished = false;
    };

    apps.add(id, newApp);
    newApp;
  };

  public shared ({ caller }) func addScreen(input : AddScreenInput) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(input.appId);
    checkOwner(caller, app);

    let newScreen : AppScreen = {
      id = input.screenId;
      title = input.title;
      content = input.content;
    };

    let updatedScreens = app.screens.concat([newScreen]);
    let updatedApp : App = {
      id = app.id;
      name = app.name;
      description = app.description;
      owner = app.owner;
      screens = updatedScreens;
      icon = app.icon;
      screenshots = app.screenshots;
      isPublished = app.isPublished;
    };
    apps.add(input.appId, updatedApp);
    updatedApp;
  };

  public shared ({ caller }) func uploadIcon(input : UploadIconInput) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(input.appId);
    checkOwner(caller, app);

    let updatedApp : App = {
      id = app.id;
      name = app.name;
      description = app.description;
      owner = app.owner;
      screens = app.screens;
      icon = ?input.icon;
      screenshots = app.screenshots;
      isPublished = app.isPublished;
    };
    apps.add(input.appId, updatedApp);
    updatedApp;
  };

  public shared ({ caller }) func addScreenshot(input : AddScreenshotInput) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(input.appId);
    checkOwner(caller, app);

    let updatedScreenshots = app.screenshots.concat([input.screenshot]);
    let updatedApp : App = {
      id = app.id;
      name = app.name;
      description = app.description;
      owner = app.owner;
      screens = app.screens;
      icon = app.icon;
      screenshots = updatedScreenshots;
      isPublished = app.isPublished;
    };
    apps.add(input.appId, updatedApp);
    updatedApp;
  };

  public shared ({ caller }) func editScreen(input : EditScreenInput) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(input.appId);
    checkOwner(caller, app);

    let updatedScreens = app.screens.map(
      func(screen) {
        if (screen.id == input.screenId) {
          {
            id = input.screenId;
            title = input.title;
            content = input.content;
          };
        } else {
          screen;
        };
      }
    );

    let updatedApp : App = {
      id = app.id;
      name = app.name;
      description = app.description;
      owner = app.owner;
      screens = updatedScreens;
      icon = app.icon;
      screenshots = app.screenshots;
      isPublished = app.isPublished;
    };
    apps.add(input.appId, updatedApp);
    updatedApp;
  };

  public shared ({ caller }) func deleteScreen(appId : Text, screenId : Text) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(appId);
    checkOwner(caller, app);

    let filteredScreens = app.screens.filter(
      func(screen) { screen.id != screenId }
    );
    let updatedApp : App = {
      id = app.id;
      name = app.name;
      description = app.description;
      owner = app.owner;
      screens = filteredScreens;
      icon = app.icon;
      screenshots = app.screenshots;
      isPublished = app.isPublished;
    };
    apps.add(appId, updatedApp);
    updatedApp;
  };

  public shared ({ caller }) func publishApp(appId : Text) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(appId);
    checkOwner(caller, app);

    let updatedApp : App = {
      id = app.id;
      name = app.name;
      description = app.description;
      owner = app.owner;
      screens = app.screens;
      icon = app.icon;
      screenshots = app.screenshots;
      isPublished = true;
    };
    apps.add(appId, updatedApp);
    updatedApp;
  };

  public shared ({ caller }) func unpublishApp(appId : Text) : async App {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(appId);
    checkOwner(caller, app);

    let updatedApp : App = {
      id = app.id;
      name = app.name;
      description = app.description;
      owner = app.owner;
      screens = app.screens;
      icon = app.icon;
      screenshots = app.screenshots;
      isPublished = false;
    };
    apps.add(appId, updatedApp);
    updatedApp;
  };

  public shared ({ caller }) func deleteApp(appId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let app = getAppInternal(appId);
    checkOwner(caller, app);
    apps.remove(appId);
  };

  func getAppInternal(appId : Text) : App {
    switch (apps.get(appId)) {
      case (?app) { app };
      case (null) { Runtime.trap("App with id " # appId # " does not exist") };
    };
  };

  public query ({ caller }) func getApp(appId : Text) : async App {
    getAppInternal(appId);
  };

  public query ({ caller }) func listPublishedApps() : async [App] {
    apps.values().toArray().filter(func(app) { app.isPublished });
  };

  public query ({ caller }) func listMyApps() : async [App] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list their apps");
    };
    apps.values().toArray().filter(
      func(app) { app.owner == caller },
    );
  };
};

