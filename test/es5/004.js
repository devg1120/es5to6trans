
var SkinnedMesh = function SkinnedMesh() {
};
SkinnedMesh.prototype.update = function (camera) {
  camera = camera || createCamera();
  this.camera = camera;
};
Object.defineProperty(SkinnedMesh.prototype, 'name', {
  set: function (geometry) {
    this.geometry = geometry;
  },
  get: function () {
    return this.geometry;
  }
});
