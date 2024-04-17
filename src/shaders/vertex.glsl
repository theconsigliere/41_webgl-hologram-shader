uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

#include ./includes/random2D.glsl

void main()
  {
    //Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch
    // creates waves of glitch from the bottom to the top of the model
    float glitchTime = uTime - modelPosition.y;
    // radomize the waves of glitch
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) +  sin(glitchTime * 8.76);
    // slow down the glitch
      glitchStrength /= 3.0;
    // remap sin value from -1, 1 to 0, 1
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

        // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // verying to send to gfragment
    vPosition = modelPosition.xyz;

    // Normal
    vNormal = modelNormal.xyz;
  }