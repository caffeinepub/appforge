import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();

  public type AppScreen = {
    id : Text;
    title : Text;
    content : Text;
  };

  public type App = {
    id : Text;
    name : Text;
    description : Text;
    screens : [AppScreen];
    icon : ?Storage.ExternalBlob;
    screenshots : [Storage.ExternalBlob];
    isPublished : Bool;
  };

  public type CreateAppInput = {
    id : Text;
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

  let apps = Map.empty<Text, App>();

  public shared ({ caller }) func createApp(input : CreateAppInput) : async App {
    if (apps.containsKey(input.id)) {
      Runtime.trap("App with id " # input.id # " already exists");
    };

    let newApp : App = {
      id = input.id;
      name = input.name;
      description = input.description;
      screens = [];
      icon = null;
      screenshots = [];
      isPublished = false;
    };

    apps.add(input.id, newApp);
    newApp;
  };

  public shared ({ caller }) func addScreen(input : AddScreenInput) : async App {
    switch (apps.get(input.appId)) {
      case (null) { Runtime.trap("App with id " # input.appId # " does not exist") };
      case (?app) {
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
          screens = updatedScreens;
          icon = app.icon;
          screenshots = app.screenshots;
          isPublished = app.isPublished;
        };
        apps.add(input.appId, updatedApp);
        updatedApp;
      };
    };
  };

  public shared ({ caller }) func uploadIcon(input : UploadIconInput) : async App {
    switch (apps.get(input.appId)) {
      case (null) { Runtime.trap("App with id " # input.appId # " does not exist") };
      case (?app) {
        let updatedApp : App = {
          id = app.id;
          name = app.name;
          description = app.description;
          screens = app.screens;
          icon = ?input.icon;
          screenshots = app.screenshots;
          isPublished = app.isPublished;
        };
        apps.add(input.appId, updatedApp);
        updatedApp;
      };
    };
  };

  public shared ({ caller }) func addScreenshot(input : AddScreenshotInput) : async App {
    switch (apps.get(input.appId)) {
      case (null) { Runtime.trap("App with id " # input.appId # " does not exist") };
      case (?app) {
        let updatedScreenshots = app.screenshots.concat([input.screenshot]);
        let updatedApp : App = {
          id = app.id;
          name = app.name;
          description = app.description;
          screens = app.screens;
          icon = app.icon;
          screenshots = updatedScreenshots;
          isPublished = app.isPublished;
        };
        apps.add(input.appId, updatedApp);
        updatedApp;
      };
    };
  };

  public shared ({ caller }) func editScreen(input : EditScreenInput) : async App {
    switch (apps.get(input.appId)) {
      case (null) { Runtime.trap("App with id " # input.appId # " does not exist") };
      case (?app) {
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
          screens = updatedScreens;
          icon = app.icon;
          screenshots = app.screenshots;
          isPublished = app.isPublished;
        };
        apps.add(input.appId, updatedApp);
        updatedApp;
      };
    };
  };

  public shared ({ caller }) func deleteScreen(appId : Text, screenId : Text) : async App {
    if (not apps.containsKey(appId)) {
      Runtime.trap("App with id " # appId # " does not exist");
    };

    switch (apps.get(appId)) {
      case (null) { Runtime.trap("App with id " # appId # " does not exist") };
      case (?app) {
        let filteredScreens = app.screens.filter(
          func(screen) { screen.id != screenId }
        );
        let updatedApp : App = {
          id = app.id;
          name = app.name;
          description = app.description;
          screens = filteredScreens;
          icon = app.icon;
          screenshots = app.screenshots;
          isPublished = app.isPublished;
        };
        apps.add(appId, updatedApp);
        updatedApp;
      };
    };
  };

  public shared ({ caller }) func publishApp(appId : Text) : async App {
    switch (apps.get(appId)) {
      case (null) { Runtime.trap("App with id " # appId # " does not exist") };
      case (?app) {
        let updatedApp : App = {
          id = app.id;
          name = app.name;
          description = app.description;
          screens = app.screens;
          icon = app.icon;
          screenshots = app.screenshots;
          isPublished = true;
        };
        apps.add(appId, updatedApp);
        updatedApp;
      };
    };
  };

  public shared ({ caller }) func unpublishApp(appId : Text) : async App {
    switch (apps.get(appId)) {
      case (null) { Runtime.trap("App with id " # appId # " does not exist") };
      case (?app) {
        let updatedApp : App = {
          id = app.id;
          name = app.name;
          description = app.description;
          screens = app.screens;
          icon = app.icon;
          screenshots = app.screenshots;
          isPublished = false;
        };
        apps.add(appId, updatedApp);
        updatedApp;
      };
    };
  };

  public query ({ caller }) func getApp(appId : Text) : async App {
    switch (apps.get(appId)) {
      case (null) { Runtime.trap("App with id " # appId # " does not exist") };
      case (?app) { app };
    };
  };

  public query ({ caller }) func listPublishedApps() : async [App] {
    apps.values().toArray().filter(func(app) { app.isPublished });
  };

  public query ({ caller }) func listAllApps() : async [App] {
    apps.values().toArray();
  };
};
