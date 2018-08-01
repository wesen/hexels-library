/*
 *  Pass-Through.frag
 *  Hexels 2!
 *
 *  Created by Kenneth Kopecky in May 2016
 *  Copyright 2016 Marmoset Co. All rights reserved.
 *
 */

#define PFX_SHADER		//lets Hexels know this is a post-effect shader as opposed to a blend shader
//categories help organize the shader list
#define CATEGORY Custom

UI_Uniform_Float(angle, 0.1, 2.0, 1.);
UI_Uniform_Float(scale, 0.1, 4., 1.);


// Ruofei Du
// Dot Screen / Halftone: https://www.shadertoy.com/view/4sBBDK
// Halftone: https://www.shadertoy.com/view/lsSfWV

float greyScale(in vec3 col) {
    return dot(col, vec3(0.2126, 0.7152, 0.0722));
}

mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle),cos(angle));
}

float dotScreen(in vec2 uv, in float angle, in float scale) {
    float s = sin( angle ), c = cos( angle );
    vec2 p = (uv - vec2(0.5)) * vec2(128,128);
    vec2 q = rotate2d(angle) * p * scale; 
	return ( sin( q.x ) * sin( q.y ) ) / 2. + 0.5;
}

void main() 
{
  vec2 uv = gl_TexCoord[0].xy;
  vec3 incoming = texture2D(_Layer, uv).rgb;
        
    float grey = greyScale(incoming);
    float dots = dotScreen(uv, angle, scale);
    float col = grey * 10.0 - 5.0 + dots;
    //    gl_FragColor = vec4(1 - (incoming * (1.0 - col)  , 1.0 );
    //    gl_FragColor = vec4(incoming, col);
    // gl_FragColor = vec4(vec3(dotScreen(uv, angle, scale)), 1.0);
    vec3 _col = mix(incoming.rgb, vec3(1.), step(dots, .5));
    gl_FragColor = vec4(_col, 1.0);
}
