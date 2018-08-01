/*
 *  HardLight.frag, based on Multiply.frag in Hexels 3
 *  Hexels 2
 *
 * (c) 2018 - Marmoset, Slono
 *
 */

#define BLEND_SHADER            //lets Hexels know this is a blend shader as opposed to a PFX shader

UI_Uniform_Checkbox(Preserve_Alpha, 1);
void main()
{
        vec4 otex = texture2D(_LowerLayer, gl_TexCoord[0].xy);
        vec4 incoming = texture2D(_UpperLayer, gl_TexCoord[0].xy);

        vec3 lighter = (1.0 - (1.0 - otex.rgb) * (1.0 - 2.0 * (incoming.rgb - 0.5)));
        vec3 darker = otex.rgb * 2.0 * incoming.rgb;

        vec3 malted = mix(lighter, darker, step(incoming.rgb, vec3(0.5)));

        incoming.a *= _LayerOpacity;
        vec4 disrespectedAlpha = vec4(mix(otex.rgb, malted, incoming.a), otex.a + (1.0-otex.a) * incoming.a);

        //if we're on transparent background, instead of multiplying, we just normal-blend
        disrespectedAlpha = mix(disrespectedAlpha, incoming * vec4(incoming.aaa, 1.0), 1.0-clamp(otex.a, 0.0, 1.0));
        vec4 respectedAlpha = vec4(mix(otex.rgb, malted, incoming.a), otex.a);

        gl_FragColor = mix(disrespectedAlpha, respectedAlpha, float(Preserve_Alpha));
}
