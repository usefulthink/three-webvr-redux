import THREE from 'three';


// import modules assuming a global THREE-Object
global.THREE = THREE;

require('three/examples/js/controls/VRControls.js');
require('three/examples/js/effects/VREffect.js');
require('three/examples/js/controls/FlyControls.js');

export default THREE;
