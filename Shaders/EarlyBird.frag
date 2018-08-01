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
void main()
{
	vec4 incoming = texture2D(_Layer, gl_TexCoord[0].xy);
	
	gl_FragColor = incoming;

}

