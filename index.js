/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Input Mapping component for A-Frame.
 */
AFRAME.registerSystem('input-mapping', {
  schema: {},
  mappings: {},
  currentSection: 'default',

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    if (AFRAME.DEFAULT_INPUT_MAPPINGS) {
      this.registerInputMappings(AFRAME.DEFAULT_INPUT_MAPPINGS);
    }

    var self = this;

    // Controllers
    this.sceneEl.addEventListener('controllerconnected', function (evt) {
      if (!self.mappings) {
        console.warn('controller-mapping: No mappings defined');
        return;
      }

      for (var section in self.mappings) {
        var controllerMappings = self.mappings[section];

        var controllerModel = evt.detail.name;
        var controllerMappings = controllerMappings[controllerModel];
        if (!controllerMappings) {
          console.warn('controller-mapping: No mappings defined for controller type: ', controllerModel);
          return;
        }

        for (var eventName in controllerMappings) {
          (function () {
            var mapping = controllerMappings[eventName];
            const actionSection = section;
            self.sceneEl.addEventListener(eventName, function(evt2) {
              console.log(actionSection, eventName);
              if (self.currentSection === actionSection) {
                evt.detail.target.emit(mapping, evt2);
              }
            });
          }());
        }
      }
    });

    // Keyboard (Very WIP)
    var self = this;
    var scene = this.sceneEl;
    document.addEventListener('keyup', function (event) {
      var mappings = self.mappings[self.currentSection];

      if (mappings && mappings.keyboard) {
        mappings = mappings.keyboard;

        var mapEvent = mappings[event.key + '_up'];
        if (mapEvent) {
          scene.emit(mapEvent);
        }
      }
    });
    /*
    document.addEventListener('keydown', function (event) {
    });
    document.addEventListener('keypress', function (event) {
    });
    */
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { },

  registerInputMappings: function (mappings) {
    this.mappings = mappings;
  },

  getActiveSection: function () {
    return this.currentSection;
  },

  setActiveSection: function (section) {
    if (this.mappings[section]) {
      this.currentSection = section;
    } else {
      console.warn('aframe-input-mapping-component: Trying to activate a section that doesn\'t exist:', section);
    }
  }
});

AFRAME.registerInputMappings = function(mappings) {
  // Add mapping
  AFRAME.scenes[0].sceneEl.systems['input-mapping'].registerInputMappings(mappings);
};
