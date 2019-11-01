import G6 from '@antv/g6';
import { colorTrans } from '@/utils/utils';
import { screw } from './lib/img';

// 风扇
G6.registerNode('Fan', {
  draw(cfg, group) {
    const statusColor = cfg.color || '#6abf00';
    const width = cfg.width || 100;
    const height = cfg.height || 100;
    group.addShape('circle', {
      attrs: {
        x: 0.5 * width,
        y: 0.5 * height,
        r: width / 2,
        stroke: statusColor,
        lineWidth: 4,
        shadowColor: statusColor, // a5f7d0 038347
        shadowBlur: 10,
        fill: '#4d485c',
      },
    });
    const center = [0.5 * width, 0.5 * height];
    const tcFanC = [center[0] - 0.25 * width, center[1] - 0.25 * width];
    const tcFanCQ1 = [tcFanC[0], center[1]];
    const tcFanT = [center[0], 0];
    const tcFanCQ2 = [tcFanC[0], 0];
    const rcFanC = [center[0] + 0.25 * width, center[1] - 0.25 * height];
    const ctFanC = [center[0], center[1] - 0.25 * height];
    const rtcFanC = [center[0] + 0.5 * width, center[1] - 0.25 * height];
    const rrcFanC = [center[0] + 0.5 * width, center[1]];
    const fanColor = '#ccc'; // 6abf00

    group.addShape('path', {
      attrs: {
        path: [
          ['M', center[0], center[1]],
          ['Q', tcFanCQ1[0], tcFanCQ1[1], tcFanC[0], tcFanC[1]],
          ['Q', tcFanCQ2[0], tcFanCQ2[1], tcFanT[0], tcFanT[1]],
          ['Z'],
        ],
        x: center[0],
        y: center[1],
        fill: fanColor,
      },
    });
    group.addShape('path', {
      attrs: {
        path: [
          ['M', center[0], center[1]],
          ['Q', ctFanC[0], ctFanC[1], rcFanC[0], rcFanC[1]],
          ['Q', rtcFanC[0], rtcFanC[1], rrcFanC[0], rrcFanC[1]],
          ['Z'],
        ],
        x: center[0],
        y: center[1],
        fill: fanColor,
      },
    });
    group.addShape('path', {
      attrs: {
        path: [
          ['M', center[0], center[1]],
          [
            'Q',
            center[0] + 0.25 * width,
            center[1],
            center[0] + 0.25 * height,
            center[1] + 0.25 * height,
          ],
          [
            'Q',
            center[0] + 0.25 * width,
            center[1] + 0.5 * height,
            center[0],
            center[1] + 0.5 * height,
          ],
          ['Z'],
        ],
        x: center[0],
        y: center[1],
        fill: fanColor,
      },
    });
    group.addShape('path', {
      attrs: {
        path: [
          ['M', center[0], center[1]],
          [
            'Q',
            center[0],
            center[1] + 0.25 * height,
            center[0] - 0.25 * width,
            center[1] + 0.25 * height,
          ],
          ['Q', 0, center[1] + 0.25 * height, 0, center[1]],
          ['Z'],
        ],
        x: center[0],
        y: center[1],
        fill: fanColor,
      },
    });
    group.addShape('circle', {
      attrs: {
        r: 5,
        x: 0.5 * width,
        y: 0.5 * height,
        fill: 'r(0.5, 0.5, 0.1) 0:#ffffff 1:#969593',
      },
    });
    return group;
  },
  afterDraw(cfg, group) {
    const shape1 = group.get('children')[1];
    const shape2 = group.get('children')[2];
    const shape3 = group.get('children')[3];
    const shape4 = group.get('children')[4];
    console.log(shape1.animate);
    shape1.animate(
      {
        repeat: true,
        onFrame(ratio) {
          shape1.rotateAtStart(Math.PI / 40);
        },
      },
      2000,
      'easeCubic',
    );
    shape2.animate(
      {
        repeat: true,
        onFrame(ratio) {
          shape2.rotateAtStart(Math.PI / 40);
        },
      },
      2000,
      'easeCubic',
    );
    shape3.animate(
      {
        repeat: true,
        onFrame(ratio) {
          shape3.rotateAtStart(Math.PI / 40);
        },
      },
      2000,
      'easeCubic',
    );
    shape4.animate(
      {
        repeat: true,
        onFrame(ratio) {
          shape4.rotateAtStart(Math.PI / 40);
        },
      },
      2000,
      'easeCubic',
    );
  },
});

// 网口 携带状态灯
G6.registerNode('NetPort', {
  draw(cfg, group) {
    const shadowColor = colorTrans('#4fb0ff', 0.3);
    const parentWidth = cfg.width || 55;
    const parentHeight = cfg.height || 50;
    const innerColor = cfg.innerColor || '#646468';
    const rectColor = cfg.color || '#B7B7B7';
    const lineColor = cfg.lineColor || '#b8b8b8';
    const strokeColor = cfg.strokeColor;
    const light = cfg.light; // 1 亮灯 0 没有灯 -1 灭灯
    const lightWidth = cfg.lightWidth || 8; // 灯的大小
    const lightOffset = cfg.lightOffset || 5; // 灯在内部的偏移量
    const strokeWidth = cfg.strokeWidth || 1;
    group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: parentWidth,
        height: parentHeight,
        fill: rectColor,
        radius: 4,
        stroke: cfg.active ? '#4fb0ff' : cfg.strokeColor ? strokeColor : '',
        lineWidth: strokeWidth,
        shadowColor: cfg.active ? shadowColor : '',
        shadowBlur: 10,
      },
    });
    // var rectW = parentWidth * 0.7
    // var rectH = parentHeight * 0.7
    var rateK = 0.7;
    var rateH = 0.15; // = (1-rateK) /2
    var rightDisK = 0.25; // 长拐线水平距离系数
    var padLR = parentWidth * rateH;
    var padTB = parentHeight * rateH;
    // group.addShape('rect', {
    //   attrs: {
    //     x: 0 + padLR,
    //     y: 0 + padTB,
    //     width: rectW,
    //     height: rectH,
    //     fill: cfg.color || '#646468',
    //     stroke: (cfg.active ? '#4fb0ff' : ''),
    //     lineWidth: 2,
    //     shadowColor: (cfg.active ? shadowColor : ''),
    //     shadowBlur: 10
    //   }
    // })
    // 拐点等高
    var transHei = (rateK * parentWidth * (1 - rightDisK * 3)) / 2;
    // 内侧宽度
    var inerW = parentWidth * rateK;
    var inerH = parentHeight * rateK - 2 * transHei;
    var rightDis = rightDisK * rateK * parentWidth;
    group.addShape('path', {
      attrs: {
        path: [
          ['M', padLR, padTB + transHei * 2],
          ['L', padLR + rightDis, padTB + transHei * 2],
          ['L', padLR + rightDis, padTB + transHei * 2 - transHei],
          ['L', padLR + rightDis + transHei, padTB + transHei * 2 - transHei],
          ['L', padLR + rightDis + transHei, padTB + transHei * 2 - transHei - transHei],
          ['L', padLR + rightDis + transHei + rightDis, padTB + transHei * 2 - transHei - transHei], // 右边顶点
          ['L', padLR + rightDis + transHei + rightDis, padTB + transHei * 2 - transHei],
          ['L', padLR + rightDis + transHei + rightDis + transHei, padTB + transHei * 2 - transHei],
          ['L', padLR + rightDis + transHei + rightDis + transHei, padTB + transHei * 2],
          ['L', padLR + rightDis + transHei + rightDis + transHei + rightDis, padTB + transHei * 2],
          [
            'L',
            padLR + rightDis + transHei + rightDis + transHei + rightDis,
            padTB + rateK * parentHeight,
          ],
          [
            'L',
            padLR + rightDis + transHei + rightDis + transHei + rightDis - parentWidth * rateK,
            padTB + rateK * parentHeight,
          ],
          ['Z'],
        ],
        fill: innerColor,
      },
    });
    if (light === 1) {
      group.addShape('rect', {
        attrs: {
          x: padLR - lightOffset,
          y: padTB - lightOffset,
          width: lightWidth,
          height: lightWidth,
          radius: 2,
          fill: 'r(0.5, 0.5, 0.1) 0:#ffffff 1:#29d202',
        },
      });
      group.addShape('rect', {
        attrs: {
          x: parentWidth - (padLR - lightOffset) - lightWidth,
          y: padTB - lightOffset,
          width: lightWidth,
          height: lightWidth,
          radius: 2,
          fill: 'r(0.5, 0.5, 0.1) 0:#ffffff 1:#fd9c04',
        },
      });
    } else if (light === -1) {
      group.addShape('rect', {
        attrs: {
          x: inerW - (padLR - 5) - 8,
          y: padTB - 5,
          width: 5,
          height: 5,
          fill: '#eee',
        },
      });
    }
    // 计算底边竖线的距离
    var lineLen = inerW - 2 * rightDis;
    var lineCount = Math.ceil(lineLen / 2);
    var lineH = 0.25 * inerH;
    for (var i = 0; i < lineCount; i++) {
      group.addShape('rect', {
        attrs: {
          x: padLR + rightDis + i * 2,
          y: padTB + rateK * parentHeight - lineH - 2,
          width: 1,
          height: lineH,
          fill: lineColor,
        },
      });
    }
    if (cfg.namePos && typeof cfg.namePos === 'string') {
      if (cfg.namePos === 'bottom') {
        group.addShape('text', {
          attrs: {
            x: parentWidth / 2,
            y: parentHeight + 4,
            // width: parentWidth,
            textBaseline: 'top',
            textAlign: 'center',
            text: cfg.name,
            fill: '#444',
          },
        });
      } else if (cfg.namePos === 'top') {
        group.addShape('text', {
          attrs: {
            x: parentWidth / 2,
            y: -16,
            // width: parentWidth,
            textBaseline: 'top',
            textAlign: 'center',
            text: cfg.name,
            fill: '#444',
          },
        });
      } else if (cfg.namePos === 'left') {
        group.addShape('text', {
          attrs: {
            x: -4,
            y: parentHeight / 2,
            // width: parentWidth,
            textBaseline: 'top',
            textAlign: 'center',
            text: cfg.name,
            fill: '#444',
            rotate: 90,
          },
        });
      } else if (cfg.namePos === 'right') {
        group.addShape('text', {
          attrs: {
            x: parentWidth + 4,
            y: parentHeight / 2,
            // width: parentWidth,
            textBaseline: 'top',
            textAlign: 'center',
            text: cfg.name,
            fill: '#444',
            rotate: -90,
          },
        });
      }
    } else {
      group.addShape('text', {
        attrs: {
          x: parentWidth / 2,
          y: parentHeight + 4,
          // width: parentWidth,
          textBaseline: 'top',
          textAlign: 'center',
          text: cfg.name,
          fill: '#444',
        },
      });
    }
    return group;
  },
});

// 螺丝
G6.registerNode('screw', {
  draw(cfg, group) {
    group.addShape('circle', {
      attrs: {
        r: 10,
        x: 0,
        y: 0,
        fill: 'red',
      },
    });
    group.addShape('image', {
      width: 100,
      height: 100,
      img: screw,
    });
    return group;
  },
});
