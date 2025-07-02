const CustomShader = {
    uniforms: {
        tDiffuse: { type: "t", value: null },
        texDiv: { type: "f", value: 170.0 },
        colorMode: { type: "f", value: 0.0 },
        resolution: { type: "v", value: { x: 0, y: 0 } },
        pixelSize: { type: "f", value: 1 },
        time: { type: "f", value: 0 },
        transition: { type: "f", value: 0 },
    },

    // 0.2126 R + 0.7152 G + 0.0722 B
    // vertexshader is always the same for postprocessing steps
    vertexShader: [
        `
        varying vec2 vUv;

        void main() {

            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
        }
    `,
    ].join("\n"),

    fragmentShader: [
        `
        #ifdef GL_ES
        precision highp float;
        #endif
       

        // pass in the image/texture we'll be modifying
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float pixelSize;
        uniform float time;
        uniform float transition;

        const float MASK_BORDER = .9;

        const float ditherMatrix[16] = float[16](
            1.0,  9.0,  3.0, 11.0,
            13.0,  5.0, 15.0,  7.0,
            4.0, 12.0,  2.0, 10.0,
            16.0,  8.0, 14.0,  6.0
        );

        // Function to get the dither value based on screen position
        float getDitherValue(ivec2 pixelPos) {
            int index = (pixelPos.y % 4) * 4 + (pixelPos.x % 4); // 4x4 matrix indexing
            return ditherMatrix[index] / 17.0;                  // Normalize to [0, 1]
        }


        // used to determine the correct texel we're working on
        varying vec2 vUv;
        
        float getQuantizedRed(vec4 textureIn, vec2 coord, int offsetX, int offsetY){
            ivec2 pixelPos = ivec2(coord);
            pixelPos.x += offsetX;
            pixelPos.y += offsetY;
            float ditherValue = getDitherValue(pixelPos);
            float ditherScale = 0.7;
            float threshold = ditherValue * ditherScale;
            float ditheredRed = textureIn.r + threshold;
            // Quantize to nearest intensity step
            float quantizedRed = step(0.75, ditheredRed);

            return quantizedRed;
        }

        vec3 getQuantizedVec(vec4 textureIn, vec2 coord, int offsetX, int offsetY){
            ivec2 pixelPos = ivec2(coord);
            pixelPos.x += offsetX;
            pixelPos.y += offsetY;
            float ditherValue = getDitherValue(pixelPos);
            float ditherScale = 0.7;
            float threshold = ditherValue * ditherScale;
            
            float ditheredRed = textureIn.r + threshold;
            float ditheredGreen = textureIn.g + threshold;
            float ditheredBlue = textureIn.b + threshold;
            // Quantize to nearest intensity step
            float qr = step(0.75, ditheredRed);
            float qg = step(0.75, ditheredGreen);
            float qb = step(0.75, ditheredBlue);
            vec3 qVec = vec3(qr, qg, qb);
            return qVec;
        }
       
        void main() {
            vec2 uv = vUv.xy;

            vec2 pixel = uv * resolution;
            float newPixelSize = pixelSize + transition;
            vec2 coord = pixel / newPixelSize;
            vec2 subcoord = coord * vec2(3.0, 1.0);
            vec2 cellOffset = vec2(0, mod(floor(coord.x), 3.0) * 0.5);
            float ind = mod(floor(subcoord.x), 3.0);
            vec3 maskColor = vec3(ind == 0.0, ind == 1.0, ind == 2.0);

            vec2 cellUv = fract(subcoord + cellOffset) * 2.0 - 1.0;
            vec2 border = 1.0 - cellUv * cellUv * MASK_BORDER;
            maskColor.rgb *= border.x * border.y;

            vec2 rgbCellUV = floor(coord + cellOffset) * newPixelSize / resolution ;
           
            vec4 textureIn = texture2D(tDiffuse, rgbCellUV);
            vec4 textureInOrig = texture2D(tDiffuse, uv);
            vec3 outCol = vec3(.0);
            vec2 fc = gl_FragCoord.xy * 1.0;
            float q1 = getQuantizedRed(textureIn, fc, 0, 0);
            vec3 qVec = getQuantizedVec(textureIn, fc, 0, 0);
            outCol = qVec;
          
            //outCol.rgb *= 1.0 + (maskColor);
            //outCol *= maskColor;
            
            //float lines = sin(uv.y * 2150.0 + time * 100.0);
            //outCol *= lines + 2.0;
            //outCol += textureIn.rgb * 2.0;

            vec4 textureOrig = texture2D(tDiffuse, uv);

            
            outCol *= vec3(1.0 - transition / 200.0);
            // crt effect

            //outCol = textureOrig.rgb;
            gl_FragColor = vec4( outCol , 1.0 );
        }
    `,
    ].join("\n"),
};
