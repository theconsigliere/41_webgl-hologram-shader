
uniform float uAmountOfStripes;
uniform float uTime;
uniform float uSpeedOfStripes;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
  float alteredTime = (uTime * 0.02) * uSpeedOfStripes;

  //stripes
  // when the value (vPosition.y) reaches 1.0, the modulo will return 0.0
  // hence why we get a stripe pattern
  float stripes = mod((vPosition.y - alteredTime) * uAmountOfStripes , 1.0);
  // get a sharper gradient by multiplying the stripes by a power of 3
  stripes = pow(stripes, 3.0);

  
  // Normal
  vec3 normal = normalize(vNormal);
  // if backside invert normal
   if(!gl_FrontFacing)
        normal *= - 1.0;
 

  // Fresnel
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  // Let me explain what the dot product does in simple words:
  // Considering two vectors of the same length:
  // If they are in the same direction, we get 1
  // If they they are perpendicular, we get 0
  // If they are opposite, we get -1

  float fresnel = dot(viewDirection, normal) + 1.0;
  // make fresnel sharper
  fresnel = pow(fresnel, 2.0);


  //fallof
  // fade out edges
   float falloff = smoothstep(0.8, 0.0, fresnel);


  // Holographic
  float holographic = stripes * fresnel;
  // make holographic effect more visible
  holographic += fresnel * 1.25;
  // fade out edges
  holographic *= falloff;



  // final colour
  gl_FragColor = vec4(uColor, holographic);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}