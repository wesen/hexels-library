// https://www.shadertoy.com/view/llGSzK by tr4racer

#define PFX_SHADER		//lets Hexels know this is a post-effect shader as opposed to a blend shader
//categories help organize the shader list
#define CATEGORY Custom

const int BIT_COUNT = 32;

UI_Uniform_Float(Vibrance, -1, 1, 1);

int modi(int x, int y) {
    return x - y * (x / y);
}

int and(int a, int b) {
    int result = 0;
    int n = 1;

    for(int i = 0; i < BIT_COUNT; i++) {
        if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
            result += n;
        }

        a = a / 2;
        b = b / 2;
        n = n * 2;

        if(!(a > 0 && b > 0)) {
            break;
        }
    }
    return result;
}
vec4 vibrance(vec4 inCol, float vibrance) //r,g,b 0.0 to 1.0,  vibrance 1.0 no change, 0.0 image B&W.
{
       //float rf, gf, bf;
 
       //rf = *r;
       //gf = *g;
       //bf = *b;
 	vec4 outCol;
    if (vibrance <= 1.0)
    {
        float avg = (inCol[0]*0.3 + inCol[1]*0.6 + inCol[2]*0.1);
        //outCol = inCol * avg;
        outCol[0] = inCol[0] * vibrance + avg*(1.0 - vibrance);
        outCol[1] = inCol[1] * vibrance + avg*(1.0 - vibrance);
        outCol[2] = inCol[2] * vibrance + avg*(1.0 - vibrance);
    }
    else // vibrance > 1.0
    {
        float hue_a, a, f, p1, p2, p3, i, h, s, v, amt, _max, _min, dlt;
        float br1, br2, br3, br4, br5, br2_or_br1, br3_or_br1, br4_or_br1, br5_or_br1;
        int use;

        _min = min(min(inCol[0], inCol[1]), inCol[2]);
        _max = max(max(inCol[0], inCol[1]), inCol[2]);
        dlt = _max - _min + 0.00001 /*Hack to fix divide zero infinities*/;
        h = 0.0;
        v = _max;

		br1 = 1.0 - float(_max > 0.0);
        s = (dlt / _max)*(1.0 - br1);
        h = -1.0*br1;

        br2 = float((_max - inCol[0]) > 0.0);
        br2_or_br1 = max(br2, br1);
        h = ((inCol[1] - inCol[2]) / dlt)*(1.0 - br2_or_br1) + (h*br2_or_br1);

        br3 = float((_max - inCol[1]) > 0.0);

        
        br3_or_br1 = max(br3, br1);
        h = (2.0 + (inCol[2] - inCol[0]) / dlt)*(1.0 - br3_or_br1) + (h*br3_or_br1);

        br4 = 1.0 - br2*br3;
        br4_or_br1 = max(br4, br1);
        h = (4.0 + (inCol[0] - inCol[1]) / dlt)*(1.0 - br4_or_br1) + (h*br4_or_br1);

        h = h*(1.0 - br1);


        hue_a = abs(h); // between h of -1 and 1 are skin tones
        a = dlt;      // Reducing enhancements on small rgb differences

        a = float(hue_a < 1.0)*a*(hue_a*0.67 + 0.33) + float(hue_a >= 1.0)*a;       //Reduce the enhancements on skin tones.                                        
        a *= (vibrance - 1.0);
        s = (1.0 - a) * s + a*pow(s, 0.25);



        i = floor(h);
        f = h - i;

        p1 = v * (1.0 - s);
        p2 = v * (1.0 - (s * f));
        p3 = v * (1.0 - (s * (1.0 - f)));

        inCol[0] = inCol[1] = inCol[2] = 0.0;
        i += 6.0;
        //use = 1 << ((int)i % 6);
        use = int(pow(2.0,mod(i,6.0)));
        a = float(and(use , 1)); // i == 0;
        use /= 2;
        inCol[0] += a*v;
        inCol[1] += a*p3;
     	inCol[2] += a*p1;
 
        a = float(and(use , 1)); // i == 1;
        use /=2;
        inCol[0] += a*p2;
        inCol[1] += a*v;
        inCol[2] += a*p1;

        a = float( and(use,1)); // i == 2;
        use /=2;
        inCol[0] += a*p1;
        inCol[1] += a*v;
        inCol[2] += a*p3;

        a = float(and(use, 1)); // i == 3;
        use /= 2;
        inCol[0] += a*p1;
        inCol[1] += a*p2;
        inCol[2] += a*v;

        a = float(and(use, 1)); // i == 4;
        use /=2;
        inCol[0] += a*p3;
        inCol[1] += a*p1;
        inCol[2] += a*v;

        a = float(and(use, 1)); // i == 5;
        use /=2;
        inCol[0] += a*v;
        inCol[1] += a*p1;
        inCol[2] += a*p2;

        outCol = inCol;
        //*r = rf;
        //*g = gf;
        //*b = bf;
    }
    return outCol;
}




void main()
{
	vec4 incoming = texture2D(_Layer, gl_TexCoord[0].xy);
    float vibrance_0 = 4.0 + 4.0* Vibrance;
	gl_FragColor = vibrance(incoming, vibrance_0);
}

