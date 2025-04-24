// @ts-nocheck
// Bundled Lit Action

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from3, except, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// node_modules/multiformats/esm/vendor/base-x.js
function base(ALPHABET, name2) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode6(source) {
    if (source instanceof Uint8Array) ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length2 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length2) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      pbegin++;
    }
    var it2 = size - length2;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length2) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length2;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode7(string2) {
    var buffer2 = decodeUnsafe(string2);
    if (buffer2) {
      return buffer2;
    }
    throw new Error(`Non-${name2} character`);
  }
  return {
    encode: encode6,
    decodeUnsafe,
    decode: decode7
  };
}
var src, _brrp__multiformats_scope_baseX, base_x_default;
var init_base_x = __esm({
  "node_modules/multiformats/esm/vendor/base-x.js"() {
    init_esbuild_shims();
    src = base;
    _brrp__multiformats_scope_baseX = src;
    base_x_default = _brrp__multiformats_scope_baseX;
  }
});

// node_modules/multiformats/esm/src/bytes.js
var empty, equals, coerce, fromString, toString;
var init_bytes = __esm({
  "node_modules/multiformats/esm/src/bytes.js"() {
    init_esbuild_shims();
    empty = new Uint8Array(0);
    equals = (aa, bb) => {
      if (aa === bb)
        return true;
      if (aa.byteLength !== bb.byteLength) {
        return false;
      }
      for (let ii = 0; ii < aa.byteLength; ii++) {
        if (aa[ii] !== bb[ii]) {
          return false;
        }
      }
      return true;
    };
    coerce = (o) => {
      if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
        return o;
      if (o instanceof ArrayBuffer)
        return new Uint8Array(o);
      if (ArrayBuffer.isView(o)) {
        return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
      }
      throw new Error("Unknown type, must be binary type");
    };
    fromString = (str) => new TextEncoder().encode(str);
    toString = (b2) => new TextDecoder().decode(b2);
  }
});

// node_modules/multiformats/esm/src/bases/base.js
var Encoder, Decoder, ComposedDecoder, or, Codec, from, baseX, decode, encode, rfc4648;
var init_base = __esm({
  "node_modules/multiformats/esm/src/bases/base.js"() {
    init_esbuild_shims();
    init_base_x();
    init_bytes();
    Encoder = class {
      constructor(name2, prefix, baseEncode) {
        this.name = name2;
        this.prefix = prefix;
        this.baseEncode = baseEncode;
      }
      encode(bytes) {
        if (bytes instanceof Uint8Array) {
          return `${this.prefix}${this.baseEncode(bytes)}`;
        } else {
          throw Error("Unknown type, must be binary type");
        }
      }
    };
    Decoder = class {
      constructor(name2, prefix, baseDecode) {
        this.name = name2;
        this.prefix = prefix;
        if (prefix.codePointAt(0) === void 0) {
          throw new Error("Invalid prefix character");
        }
        this.prefixCodePoint = prefix.codePointAt(0);
        this.baseDecode = baseDecode;
      }
      decode(text) {
        if (typeof text === "string") {
          if (text.codePointAt(0) !== this.prefixCodePoint) {
            throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
          }
          return this.baseDecode(text.slice(this.prefix.length));
        } else {
          throw Error("Can only multibase decode strings");
        }
      }
      or(decoder) {
        return or(this, decoder);
      }
    };
    ComposedDecoder = class {
      constructor(decoders) {
        this.decoders = decoders;
      }
      or(decoder) {
        return or(this, decoder);
      }
      decode(input) {
        const prefix = input[0];
        const decoder = this.decoders[prefix];
        if (decoder) {
          return decoder.decode(input);
        } else {
          throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
        }
      }
    };
    or = (left, right) => new ComposedDecoder({
      ...left.decoders || { [left.prefix]: left },
      ...right.decoders || { [right.prefix]: right }
    });
    Codec = class {
      constructor(name2, prefix, baseEncode, baseDecode) {
        this.name = name2;
        this.prefix = prefix;
        this.baseEncode = baseEncode;
        this.baseDecode = baseDecode;
        this.encoder = new Encoder(name2, prefix, baseEncode);
        this.decoder = new Decoder(name2, prefix, baseDecode);
      }
      encode(input) {
        return this.encoder.encode(input);
      }
      decode(input) {
        return this.decoder.decode(input);
      }
    };
    from = ({ name: name2, prefix, encode: encode6, decode: decode7 }) => new Codec(name2, prefix, encode6, decode7);
    baseX = ({ prefix, name: name2, alphabet: alphabet2 }) => {
      const { encode: encode6, decode: decode7 } = base_x_default(alphabet2, name2);
      return from({
        prefix,
        name: name2,
        encode: encode6,
        decode: (text) => coerce(decode7(text))
      });
    };
    decode = (string2, alphabet2, bitsPerChar, name2) => {
      const codes = {};
      for (let i = 0; i < alphabet2.length; ++i) {
        codes[alphabet2[i]] = i;
      }
      let end = string2.length;
      while (string2[end - 1] === "=") {
        --end;
      }
      const out = new Uint8Array(end * bitsPerChar / 8 | 0);
      let bits = 0;
      let buffer2 = 0;
      let written = 0;
      for (let i = 0; i < end; ++i) {
        const value = codes[string2[i]];
        if (value === void 0) {
          throw new SyntaxError(`Non-${name2} character`);
        }
        buffer2 = buffer2 << bitsPerChar | value;
        bits += bitsPerChar;
        if (bits >= 8) {
          bits -= 8;
          out[written++] = 255 & buffer2 >> bits;
        }
      }
      if (bits >= bitsPerChar || 255 & buffer2 << 8 - bits) {
        throw new SyntaxError("Unexpected end of data");
      }
      return out;
    };
    encode = (data, alphabet2, bitsPerChar) => {
      const pad = alphabet2[alphabet2.length - 1] === "=";
      const mask = (1 << bitsPerChar) - 1;
      let out = "";
      let bits = 0;
      let buffer2 = 0;
      for (let i = 0; i < data.length; ++i) {
        buffer2 = buffer2 << 8 | data[i];
        bits += 8;
        while (bits > bitsPerChar) {
          bits -= bitsPerChar;
          out += alphabet2[mask & buffer2 >> bits];
        }
      }
      if (bits) {
        out += alphabet2[mask & buffer2 << bitsPerChar - bits];
      }
      if (pad) {
        while (out.length * bitsPerChar & 7) {
          out += "=";
        }
      }
      return out;
    };
    rfc4648 = ({ name: name2, prefix, bitsPerChar, alphabet: alphabet2 }) => {
      return from({
        prefix,
        name: name2,
        encode(input) {
          return encode(input, alphabet2, bitsPerChar);
        },
        decode(input) {
          return decode(input, alphabet2, bitsPerChar, name2);
        }
      });
    };
  }
});

// node_modules/multiformats/esm/src/bases/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});
var identity;
var init_identity = __esm({
  "node_modules/multiformats/esm/src/bases/identity.js"() {
    init_esbuild_shims();
    init_base();
    init_bytes();
    identity = from({
      prefix: "\0",
      name: "identity",
      encode: (buf2) => toString(buf2),
      decode: (str) => fromString(str)
    });
  }
});

// node_modules/multiformats/esm/src/bases/base2.js
var base2_exports = {};
__export(base2_exports, {
  base2: () => base2
});
var base2;
var init_base2 = __esm({
  "node_modules/multiformats/esm/src/bases/base2.js"() {
    init_esbuild_shims();
    init_base();
    base2 = rfc4648({
      prefix: "0",
      name: "base2",
      alphabet: "01",
      bitsPerChar: 1
    });
  }
});

// node_modules/multiformats/esm/src/bases/base8.js
var base8_exports = {};
__export(base8_exports, {
  base8: () => base8
});
var base8;
var init_base8 = __esm({
  "node_modules/multiformats/esm/src/bases/base8.js"() {
    init_esbuild_shims();
    init_base();
    base8 = rfc4648({
      prefix: "7",
      name: "base8",
      alphabet: "01234567",
      bitsPerChar: 3
    });
  }
});

// node_modules/multiformats/esm/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
});
var base10;
var init_base10 = __esm({
  "node_modules/multiformats/esm/src/bases/base10.js"() {
    init_esbuild_shims();
    init_base();
    base10 = baseX({
      prefix: "9",
      name: "base10",
      alphabet: "0123456789"
    });
  }
});

// node_modules/multiformats/esm/src/bases/base16.js
var base16_exports = {};
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper
});
var base16, base16upper;
var init_base16 = __esm({
  "node_modules/multiformats/esm/src/bases/base16.js"() {
    init_esbuild_shims();
    init_base();
    base16 = rfc4648({
      prefix: "f",
      name: "base16",
      alphabet: "0123456789abcdef",
      bitsPerChar: 4
    });
    base16upper = rfc4648({
      prefix: "F",
      name: "base16upper",
      alphabet: "0123456789ABCDEF",
      bitsPerChar: 4
    });
  }
});

// node_modules/multiformats/esm/src/bases/base32.js
var base32_exports = {};
__export(base32_exports, {
  base32: () => base32,
  base32hex: () => base32hex,
  base32hexpad: () => base32hexpad,
  base32hexpadupper: () => base32hexpadupper,
  base32hexupper: () => base32hexupper,
  base32pad: () => base32pad,
  base32padupper: () => base32padupper,
  base32upper: () => base32upper,
  base32z: () => base32z
});
var base32, base32upper, base32pad, base32padupper, base32hex, base32hexupper, base32hexpad, base32hexpadupper, base32z;
var init_base32 = __esm({
  "node_modules/multiformats/esm/src/bases/base32.js"() {
    init_esbuild_shims();
    init_base();
    base32 = rfc4648({
      prefix: "b",
      name: "base32",
      alphabet: "abcdefghijklmnopqrstuvwxyz234567",
      bitsPerChar: 5
    });
    base32upper = rfc4648({
      prefix: "B",
      name: "base32upper",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
      bitsPerChar: 5
    });
    base32pad = rfc4648({
      prefix: "c",
      name: "base32pad",
      alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
      bitsPerChar: 5
    });
    base32padupper = rfc4648({
      prefix: "C",
      name: "base32padupper",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
      bitsPerChar: 5
    });
    base32hex = rfc4648({
      prefix: "v",
      name: "base32hex",
      alphabet: "0123456789abcdefghijklmnopqrstuv",
      bitsPerChar: 5
    });
    base32hexupper = rfc4648({
      prefix: "V",
      name: "base32hexupper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
      bitsPerChar: 5
    });
    base32hexpad = rfc4648({
      prefix: "t",
      name: "base32hexpad",
      alphabet: "0123456789abcdefghijklmnopqrstuv=",
      bitsPerChar: 5
    });
    base32hexpadupper = rfc4648({
      prefix: "T",
      name: "base32hexpadupper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
      bitsPerChar: 5
    });
    base32z = rfc4648({
      prefix: "h",
      name: "base32z",
      alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
      bitsPerChar: 5
    });
  }
});

// node_modules/multiformats/esm/src/bases/base36.js
var base36_exports = {};
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper
});
var base36, base36upper;
var init_base36 = __esm({
  "node_modules/multiformats/esm/src/bases/base36.js"() {
    init_esbuild_shims();
    init_base();
    base36 = baseX({
      prefix: "k",
      name: "base36",
      alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
    });
    base36upper = baseX({
      prefix: "K",
      name: "base36upper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });
  }
});

// node_modules/multiformats/esm/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr
});
var base58btc, base58flickr;
var init_base58 = __esm({
  "node_modules/multiformats/esm/src/bases/base58.js"() {
    init_esbuild_shims();
    init_base();
    base58btc = baseX({
      name: "base58btc",
      prefix: "z",
      alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    });
    base58flickr = baseX({
      name: "base58flickr",
      prefix: "Z",
      alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    });
  }
});

// node_modules/multiformats/esm/src/bases/base64.js
var base64_exports = {};
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad
});
var base64, base64pad, base64url, base64urlpad;
var init_base64 = __esm({
  "node_modules/multiformats/esm/src/bases/base64.js"() {
    init_esbuild_shims();
    init_base();
    base64 = rfc4648({
      prefix: "m",
      name: "base64",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      bitsPerChar: 6
    });
    base64pad = rfc4648({
      prefix: "M",
      name: "base64pad",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      bitsPerChar: 6
    });
    base64url = rfc4648({
      prefix: "u",
      name: "base64url",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
      bitsPerChar: 6
    });
    base64urlpad = rfc4648({
      prefix: "U",
      name: "base64urlpad",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
      bitsPerChar: 6
    });
  }
});

// node_modules/multiformats/esm/src/bases/base256emoji.js
var base256emoji_exports = {};
__export(base256emoji_exports, {
  base256emoji: () => base256emoji
});
function encode2(data) {
  return data.reduce((p2, c) => {
    p2 += alphabetBytesToChars[c];
    return p2;
  }, "");
}
function decode2(str) {
  const byts = [];
  for (const char of str) {
    const byt = alphabetCharsToBytes[char.codePointAt(0)];
    if (byt === void 0) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
var alphabet, alphabetBytesToChars, alphabetCharsToBytes, base256emoji;
var init_base256emoji = __esm({
  "node_modules/multiformats/esm/src/bases/base256emoji.js"() {
    init_esbuild_shims();
    init_base();
    alphabet = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
    alphabetBytesToChars = alphabet.reduce((p2, c, i) => {
      p2[i] = c;
      return p2;
    }, []);
    alphabetCharsToBytes = alphabet.reduce((p2, c, i) => {
      p2[c.codePointAt(0)] = i;
      return p2;
    }, []);
    base256emoji = from({
      prefix: "\u{1F680}",
      name: "base256emoji",
      encode: encode2,
      decode: decode2
    });
  }
});

// node_modules/multiformats/esm/vendor/varint.js
function encode3(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode3.bytes = offset - oldOffset + 1;
  return out;
}
function read(buf2, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b2, l2 = buf2.length;
  do {
    if (counter >= l2) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b2 = buf2[counter++];
    res += shift < 28 ? (b2 & REST$1) << shift : (b2 & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b2 >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var encode_1, MSB, REST, MSBALL, INT, decode3, MSB$1, REST$1, N1, N2, N3, N4, N5, N6, N7, N8, N9, length, varint, _brrp_varint, varint_default;
var init_varint = __esm({
  "node_modules/multiformats/esm/vendor/varint.js"() {
    init_esbuild_shims();
    encode_1 = encode3;
    MSB = 128;
    REST = 127;
    MSBALL = ~REST;
    INT = Math.pow(2, 31);
    decode3 = read;
    MSB$1 = 128;
    REST$1 = 127;
    N1 = Math.pow(2, 7);
    N2 = Math.pow(2, 14);
    N3 = Math.pow(2, 21);
    N4 = Math.pow(2, 28);
    N5 = Math.pow(2, 35);
    N6 = Math.pow(2, 42);
    N7 = Math.pow(2, 49);
    N8 = Math.pow(2, 56);
    N9 = Math.pow(2, 63);
    length = function(value) {
      return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
    };
    varint = {
      encode: encode_1,
      decode: decode3,
      encodingLength: length
    };
    _brrp_varint = varint;
    varint_default = _brrp_varint;
  }
});

// node_modules/multiformats/esm/src/varint.js
var decode4, encodeTo, encodingLength;
var init_varint2 = __esm({
  "node_modules/multiformats/esm/src/varint.js"() {
    init_esbuild_shims();
    init_varint();
    decode4 = (data, offset = 0) => {
      const code2 = varint_default.decode(data, offset);
      return [
        code2,
        varint_default.decode.bytes
      ];
    };
    encodeTo = (int, target, offset = 0) => {
      varint_default.encode(int, target, offset);
      return target;
    };
    encodingLength = (int) => {
      return varint_default.encodingLength(int);
    };
  }
});

// node_modules/multiformats/esm/src/hashes/digest.js
var digest_exports = {};
__export(digest_exports, {
  Digest: () => Digest,
  create: () => create,
  decode: () => decode5,
  equals: () => equals2
});
var create, decode5, equals2, Digest;
var init_digest = __esm({
  "node_modules/multiformats/esm/src/hashes/digest.js"() {
    init_esbuild_shims();
    init_bytes();
    init_varint2();
    create = (code2, digest2) => {
      const size = digest2.byteLength;
      const sizeOffset = encodingLength(code2);
      const digestOffset = sizeOffset + encodingLength(size);
      const bytes = new Uint8Array(digestOffset + size);
      encodeTo(code2, bytes, 0);
      encodeTo(size, bytes, sizeOffset);
      bytes.set(digest2, digestOffset);
      return new Digest(code2, size, digest2, bytes);
    };
    decode5 = (multihash) => {
      const bytes = coerce(multihash);
      const [code2, sizeOffset] = decode4(bytes);
      const [size, digestOffset] = decode4(bytes.subarray(sizeOffset));
      const digest2 = bytes.subarray(sizeOffset + digestOffset);
      if (digest2.byteLength !== size) {
        throw new Error("Incorrect length");
      }
      return new Digest(code2, size, digest2, bytes);
    };
    equals2 = (a, b2) => {
      if (a === b2) {
        return true;
      } else {
        return a.code === b2.code && a.size === b2.size && equals(a.bytes, b2.bytes);
      }
    };
    Digest = class {
      constructor(code2, size, digest2, bytes) {
        this.code = code2;
        this.size = size;
        this.digest = digest2;
        this.bytes = bytes;
      }
    };
  }
});

// node_modules/multiformats/esm/src/hashes/hasher.js
var from2, Hasher;
var init_hasher = __esm({
  "node_modules/multiformats/esm/src/hashes/hasher.js"() {
    init_esbuild_shims();
    init_digest();
    from2 = ({ name: name2, code: code2, encode: encode6 }) => new Hasher(name2, code2, encode6);
    Hasher = class {
      constructor(name2, code2, encode6) {
        this.name = name2;
        this.code = code2;
        this.encode = encode6;
      }
      digest(input) {
        if (input instanceof Uint8Array) {
          const result = this.encode(input);
          return result instanceof Uint8Array ? create(this.code, result) : result.then((digest2) => create(this.code, digest2));
        } else {
          throw Error("Unknown type, must be binary type");
        }
      }
    };
  }
});

// node_modules/multiformats/esm/src/hashes/sha2-browser.js
var sha2_browser_exports = {};
__export(sha2_browser_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});
var sha, sha256, sha512;
var init_sha2_browser = __esm({
  "node_modules/multiformats/esm/src/hashes/sha2-browser.js"() {
    init_esbuild_shims();
    init_hasher();
    sha = (name2) => async (data) => new Uint8Array(await crypto.subtle.digest(name2, data));
    sha256 = from2({
      name: "sha2-256",
      code: 18,
      encode: sha("SHA-256")
    });
    sha512 = from2({
      name: "sha2-512",
      code: 19,
      encode: sha("SHA-512")
    });
  }
});

// node_modules/multiformats/esm/src/hashes/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});
var code, name, encode4, digest, identity2;
var init_identity2 = __esm({
  "node_modules/multiformats/esm/src/hashes/identity.js"() {
    init_esbuild_shims();
    init_bytes();
    init_digest();
    code = 0;
    name = "identity";
    encode4 = coerce;
    digest = (input) => create(code, encode4(input));
    identity2 = {
      code,
      name,
      encode: encode4,
      digest
    };
  }
});

// node_modules/multiformats/esm/src/codecs/raw.js
var init_raw = __esm({
  "node_modules/multiformats/esm/src/codecs/raw.js"() {
    init_esbuild_shims();
    init_bytes();
  }
});

// node_modules/multiformats/esm/src/codecs/json.js
var textEncoder, textDecoder;
var init_json = __esm({
  "node_modules/multiformats/esm/src/codecs/json.js"() {
    init_esbuild_shims();
    textEncoder = new TextEncoder();
    textDecoder = new TextDecoder();
  }
});

// node_modules/multiformats/esm/src/cid.js
var cid_exports = {};
__export(cid_exports, {
  CID: () => CID
});
var CID, parseCIDtoBytes, toStringV0, toStringV1, DAG_PB_CODE, SHA_256_CODE, encodeCID, cidSymbol, readonly, hidden, version, deprecate, IS_CID_DEPRECATION;
var init_cid = __esm({
  "node_modules/multiformats/esm/src/cid.js"() {
    init_esbuild_shims();
    init_varint2();
    init_digest();
    init_base58();
    init_base32();
    init_bytes();
    CID = class _CID {
      constructor(version2, code2, multihash, bytes) {
        this.code = code2;
        this.version = version2;
        this.multihash = multihash;
        this.bytes = bytes;
        this.byteOffset = bytes.byteOffset;
        this.byteLength = bytes.byteLength;
        this.asCID = this;
        this._baseCache = /* @__PURE__ */ new Map();
        Object.defineProperties(this, {
          byteOffset: hidden,
          byteLength: hidden,
          code: readonly,
          version: readonly,
          multihash: readonly,
          bytes: readonly,
          _baseCache: hidden,
          asCID: hidden
        });
      }
      toV0() {
        switch (this.version) {
          case 0: {
            return this;
          }
          default: {
            const { code: code2, multihash } = this;
            if (code2 !== DAG_PB_CODE) {
              throw new Error("Cannot convert a non dag-pb CID to CIDv0");
            }
            if (multihash.code !== SHA_256_CODE) {
              throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
            }
            return _CID.createV0(multihash);
          }
        }
      }
      toV1() {
        switch (this.version) {
          case 0: {
            const { code: code2, digest: digest2 } = this.multihash;
            const multihash = create(code2, digest2);
            return _CID.createV1(this.code, multihash);
          }
          case 1: {
            return this;
          }
          default: {
            throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
          }
        }
      }
      equals(other) {
        return other && this.code === other.code && this.version === other.version && equals2(this.multihash, other.multihash);
      }
      toString(base3) {
        const { bytes, version: version2, _baseCache } = this;
        switch (version2) {
          case 0:
            return toStringV0(bytes, _baseCache, base3 || base58btc.encoder);
          default:
            return toStringV1(bytes, _baseCache, base3 || base32.encoder);
        }
      }
      toJSON() {
        return {
          code: this.code,
          version: this.version,
          hash: this.multihash.bytes
        };
      }
      get [Symbol.toStringTag]() {
        return "CID";
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return "CID(" + this.toString() + ")";
      }
      static isCID(value) {
        deprecate(/^0\.0/, IS_CID_DEPRECATION);
        return !!(value && (value[cidSymbol] || value.asCID === value));
      }
      get toBaseEncodedString() {
        throw new Error("Deprecated, use .toString()");
      }
      get codec() {
        throw new Error('"codec" property is deprecated, use integer "code" property instead');
      }
      get buffer() {
        throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead");
      }
      get multibaseName() {
        throw new Error('"multibaseName" property is deprecated');
      }
      get prefix() {
        throw new Error('"prefix" property is deprecated');
      }
      static asCID(value) {
        if (value instanceof _CID) {
          return value;
        } else if (value != null && value.asCID === value) {
          const { version: version2, code: code2, multihash, bytes } = value;
          return new _CID(version2, code2, multihash, bytes || encodeCID(version2, code2, multihash.bytes));
        } else if (value != null && value[cidSymbol] === true) {
          const { version: version2, multihash, code: code2 } = value;
          const digest2 = decode5(multihash);
          return _CID.create(version2, code2, digest2);
        } else {
          return null;
        }
      }
      static create(version2, code2, digest2) {
        if (typeof code2 !== "number") {
          throw new Error("String codecs are no longer supported");
        }
        switch (version2) {
          case 0: {
            if (code2 !== DAG_PB_CODE) {
              throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
            } else {
              return new _CID(version2, code2, digest2, digest2.bytes);
            }
          }
          case 1: {
            const bytes = encodeCID(version2, code2, digest2.bytes);
            return new _CID(version2, code2, digest2, bytes);
          }
          default: {
            throw new Error("Invalid version");
          }
        }
      }
      static createV0(digest2) {
        return _CID.create(0, DAG_PB_CODE, digest2);
      }
      static createV1(code2, digest2) {
        return _CID.create(1, code2, digest2);
      }
      static decode(bytes) {
        const [cid, remainder] = _CID.decodeFirst(bytes);
        if (remainder.length) {
          throw new Error("Incorrect length");
        }
        return cid;
      }
      static decodeFirst(bytes) {
        const specs = _CID.inspectBytes(bytes);
        const prefixSize = specs.size - specs.multihashSize;
        const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
        if (multihashBytes.byteLength !== specs.multihashSize) {
          throw new Error("Incorrect length");
        }
        const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
        const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
        const cid = specs.version === 0 ? _CID.createV0(digest2) : _CID.createV1(specs.codec, digest2);
        return [
          cid,
          bytes.subarray(specs.size)
        ];
      }
      static inspectBytes(initialBytes) {
        let offset = 0;
        const next = () => {
          const [i, length2] = decode4(initialBytes.subarray(offset));
          offset += length2;
          return i;
        };
        let version2 = next();
        let codec = DAG_PB_CODE;
        if (version2 === 18) {
          version2 = 0;
          offset = 0;
        } else if (version2 === 1) {
          codec = next();
        }
        if (version2 !== 0 && version2 !== 1) {
          throw new RangeError(`Invalid CID version ${version2}`);
        }
        const prefixSize = offset;
        const multihashCode = next();
        const digestSize = next();
        const size = offset + digestSize;
        const multihashSize = size - prefixSize;
        return {
          version: version2,
          codec,
          multihashCode,
          digestSize,
          multihashSize,
          size
        };
      }
      static parse(source, base3) {
        const [prefix, bytes] = parseCIDtoBytes(source, base3);
        const cid = _CID.decode(bytes);
        cid._baseCache.set(prefix, source);
        return cid;
      }
    };
    parseCIDtoBytes = (source, base3) => {
      switch (source[0]) {
        case "Q": {
          const decoder = base3 || base58btc;
          return [
            base58btc.prefix,
            decoder.decode(`${base58btc.prefix}${source}`)
          ];
        }
        case base58btc.prefix: {
          const decoder = base3 || base58btc;
          return [
            base58btc.prefix,
            decoder.decode(source)
          ];
        }
        case base32.prefix: {
          const decoder = base3 || base32;
          return [
            base32.prefix,
            decoder.decode(source)
          ];
        }
        default: {
          if (base3 == null) {
            throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
          }
          return [
            source[0],
            base3.decode(source)
          ];
        }
      }
    };
    toStringV0 = (bytes, cache, base3) => {
      const { prefix } = base3;
      if (prefix !== base58btc.prefix) {
        throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
      }
      const cid = cache.get(prefix);
      if (cid == null) {
        const cid2 = base3.encode(bytes).slice(1);
        cache.set(prefix, cid2);
        return cid2;
      } else {
        return cid;
      }
    };
    toStringV1 = (bytes, cache, base3) => {
      const { prefix } = base3;
      const cid = cache.get(prefix);
      if (cid == null) {
        const cid2 = base3.encode(bytes);
        cache.set(prefix, cid2);
        return cid2;
      } else {
        return cid;
      }
    };
    DAG_PB_CODE = 112;
    SHA_256_CODE = 18;
    encodeCID = (version2, code2, multihash) => {
      const codeOffset = encodingLength(version2);
      const hashOffset = codeOffset + encodingLength(code2);
      const bytes = new Uint8Array(hashOffset + multihash.byteLength);
      encodeTo(version2, bytes, 0);
      encodeTo(code2, bytes, codeOffset);
      bytes.set(multihash, hashOffset);
      return bytes;
    };
    cidSymbol = Symbol.for("@ipld/js-cid/CID");
    readonly = {
      writable: false,
      configurable: false,
      enumerable: true
    };
    hidden = {
      writable: false,
      enumerable: false,
      configurable: false
    };
    version = "0.0.0-dev";
    deprecate = (range, message) => {
      if (range.test(version)) {
        console.warn(message);
      } else {
        throw new Error(message);
      }
    };
    IS_CID_DEPRECATION = `CID.isCID(v) is deprecated and will be removed in the next major release.
Following code pattern:

if (CID.isCID(value)) {
  doSomethingWithCID(value)
}

Is replaced with:

const cid = CID.asCID(value)
if (cid) {
  // Make sure to use cid instead of value
  doSomethingWithCID(cid)
}
`;
  }
});

// node_modules/multiformats/esm/src/index.js
var init_src = __esm({
  "node_modules/multiformats/esm/src/index.js"() {
    init_esbuild_shims();
    init_cid();
    init_varint2();
    init_bytes();
    init_hasher();
    init_digest();
  }
});

// node_modules/multiformats/esm/src/basics.js
var bases, hashes;
var init_basics = __esm({
  "node_modules/multiformats/esm/src/basics.js"() {
    init_esbuild_shims();
    init_identity();
    init_base2();
    init_base8();
    init_base10();
    init_base16();
    init_base32();
    init_base36();
    init_base58();
    init_base64();
    init_base256emoji();
    init_sha2_browser();
    init_identity2();
    init_raw();
    init_json();
    init_src();
    bases = {
      ...identity_exports,
      ...base2_exports,
      ...base8_exports,
      ...base10_exports,
      ...base16_exports,
      ...base32_exports,
      ...base36_exports,
      ...base58_exports,
      ...base64_exports,
      ...base256emoji_exports
    };
    hashes = {
      ...sha2_browser_exports,
      ...identity_exports2
    };
  }
});

// node_modules/uint8arrays/esm/src/util/as-uint8array.js
function asUint8Array(buf2) {
  if (globalThis.Buffer != null) {
    return new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength);
  }
  return buf2;
}
var init_as_uint8array = __esm({
  "node_modules/uint8arrays/esm/src/util/as-uint8array.js"() {
    init_esbuild_shims();
  }
});

// node_modules/uint8arrays/esm/src/alloc.js
function allocUnsafe(size = 0) {
  if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) {
    return asUint8Array(globalThis.Buffer.allocUnsafe(size));
  }
  return new Uint8Array(size);
}
var init_alloc = __esm({
  "node_modules/uint8arrays/esm/src/alloc.js"() {
    init_esbuild_shims();
    init_as_uint8array();
  }
});

// node_modules/uint8arrays/esm/src/util/bases.js
function createCodec(name2, prefix, encode6, decode7) {
  return {
    name: name2,
    prefix,
    encoder: {
      name: name2,
      prefix,
      encode: encode6
    },
    decoder: { decode: decode7 }
  };
}
var string, ascii, BASES, bases_default;
var init_bases = __esm({
  "node_modules/uint8arrays/esm/src/util/bases.js"() {
    init_esbuild_shims();
    init_basics();
    init_alloc();
    string = createCodec("utf8", "u", (buf2) => {
      const decoder = new TextDecoder("utf8");
      return "u" + decoder.decode(buf2);
    }, (str) => {
      const encoder = new TextEncoder();
      return encoder.encode(str.substring(1));
    });
    ascii = createCodec("ascii", "a", (buf2) => {
      let string2 = "a";
      for (let i = 0; i < buf2.length; i++) {
        string2 += String.fromCharCode(buf2[i]);
      }
      return string2;
    }, (str) => {
      str = str.substring(1);
      const buf2 = allocUnsafe(str.length);
      for (let i = 0; i < str.length; i++) {
        buf2[i] = str.charCodeAt(i);
      }
      return buf2;
    });
    BASES = {
      utf8: string,
      "utf-8": string,
      hex: bases.base16,
      latin1: ascii,
      ascii,
      binary: ascii,
      ...bases
    };
    bases_default = BASES;
  }
});

// node_modules/uint8arrays/esm/src/from-string.js
var from_string_exports = {};
__export(from_string_exports, {
  fromString: () => fromString2
});
function fromString2(string2, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (!base3) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return asUint8Array(globalThis.Buffer.from(string2, "utf-8"));
  }
  return base3.decoder.decode(`${base3.prefix}${string2}`);
}
var init_from_string = __esm({
  "node_modules/uint8arrays/esm/src/from-string.js"() {
    init_esbuild_shims();
    init_bases();
    init_as_uint8array();
  }
});

// node_modules/uint8arrays/esm/src/to-string.js
var to_string_exports = {};
__export(to_string_exports, {
  toString: () => toString2
});
function toString2(array, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (!base3) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
  }
  return base3.encoder.encode(array).substring(1);
}
var init_to_string = __esm({
  "node_modules/uint8arrays/esm/src/to-string.js"() {
    init_esbuild_shims();
    init_bases();
  }
});

// node_modules/libp2p-crypto/src/webcrypto.js
var require_webcrypto = __commonJS({
  "node_modules/libp2p-crypto/src/webcrypto.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    exports2.get = (win = globalThis) => {
      const nativeCrypto = win.crypto;
      if (!nativeCrypto || !nativeCrypto.subtle) {
        throw Object.assign(
          new Error(
            "Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p-crypto/blob/master/README.md#web-crypto-api"
          ),
          { code: "ERR_MISSING_WEB_CRYPTO" }
        );
      }
      return nativeCrypto;
    };
  }
});

// node_modules/libp2p-crypto/src/hmac/lengths.js
var require_lengths = __commonJS({
  "node_modules/libp2p-crypto/src/hmac/lengths.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = {
      SHA1: 20,
      SHA256: 32,
      SHA512: 64
    };
  }
});

// node_modules/libp2p-crypto/src/hmac/index-browser.js
var require_index_browser = __commonJS({
  "node_modules/libp2p-crypto/src/hmac/index-browser.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var webcrypto = require_webcrypto();
    var lengths = require_lengths();
    var hashTypes = {
      SHA1: "SHA-1",
      SHA256: "SHA-256",
      SHA512: "SHA-512"
    };
    var sign2 = async (key, data) => {
      const buf2 = await webcrypto.get().subtle.sign({ name: "HMAC" }, key, data);
      return new Uint8Array(buf2, buf2.byteOffset, buf2.byteLength);
    };
    exports2.create = async function(hashType, secret) {
      const hash = hashTypes[hashType];
      const key = await webcrypto.get().subtle.importKey(
        "raw",
        secret,
        {
          name: "HMAC",
          hash: { name: hash }
        },
        false,
        ["sign"]
      );
      return {
        async digest(data) {
          return sign2(key, data);
        },
        length: lengths[hashType]
      };
    };
  }
});

// node_modules/node-forge/lib/forge.js
var require_forge = __commonJS({
  "node_modules/node-forge/lib/forge.js"(exports2, module2) {
    init_esbuild_shims();
    module2.exports = {
      // default options
      options: {
        usePureJavaScript: false
      }
    };
  }
});

// node_modules/node-forge/lib/baseN.js
var require_baseN = __commonJS({
  "node_modules/node-forge/lib/baseN.js"(exports2, module2) {
    init_esbuild_shims();
    var api = {};
    module2.exports = api;
    var _reverseAlphabets = {};
    api.encode = function(input, alphabet2, maxline) {
      if (typeof alphabet2 !== "string") {
        throw new TypeError('"alphabet" must be a string.');
      }
      if (maxline !== void 0 && typeof maxline !== "number") {
        throw new TypeError('"maxline" must be a number.');
      }
      var output = "";
      if (!(input instanceof Uint8Array)) {
        output = _encodeWithByteBuffer(input, alphabet2);
      } else {
        var i = 0;
        var base3 = alphabet2.length;
        var first = alphabet2.charAt(0);
        var digits = [0];
        for (i = 0; i < input.length; ++i) {
          for (var j = 0, carry = input[i]; j < digits.length; ++j) {
            carry += digits[j] << 8;
            digits[j] = carry % base3;
            carry = carry / base3 | 0;
          }
          while (carry > 0) {
            digits.push(carry % base3);
            carry = carry / base3 | 0;
          }
        }
        for (i = 0; input[i] === 0 && i < input.length - 1; ++i) {
          output += first;
        }
        for (i = digits.length - 1; i >= 0; --i) {
          output += alphabet2[digits[i]];
        }
      }
      if (maxline) {
        var regex = new RegExp(".{1," + maxline + "}", "g");
        output = output.match(regex).join("\r\n");
      }
      return output;
    };
    api.decode = function(input, alphabet2) {
      if (typeof input !== "string") {
        throw new TypeError('"input" must be a string.');
      }
      if (typeof alphabet2 !== "string") {
        throw new TypeError('"alphabet" must be a string.');
      }
      var table = _reverseAlphabets[alphabet2];
      if (!table) {
        table = _reverseAlphabets[alphabet2] = [];
        for (var i = 0; i < alphabet2.length; ++i) {
          table[alphabet2.charCodeAt(i)] = i;
        }
      }
      input = input.replace(/\s/g, "");
      var base3 = alphabet2.length;
      var first = alphabet2.charAt(0);
      var bytes = [0];
      for (var i = 0; i < input.length; i++) {
        var value = table[input.charCodeAt(i)];
        if (value === void 0) {
          return;
        }
        for (var j = 0, carry = value; j < bytes.length; ++j) {
          carry += bytes[j] * base3;
          bytes[j] = carry & 255;
          carry >>= 8;
        }
        while (carry > 0) {
          bytes.push(carry & 255);
          carry >>= 8;
        }
      }
      for (var k = 0; input[k] === first && k < input.length - 1; ++k) {
        bytes.push(0);
      }
      if (typeof Buffer !== "undefined") {
        return Buffer.from(bytes.reverse());
      }
      return new Uint8Array(bytes.reverse());
    };
    function _encodeWithByteBuffer(input, alphabet2) {
      var i = 0;
      var base3 = alphabet2.length;
      var first = alphabet2.charAt(0);
      var digits = [0];
      for (i = 0; i < input.length(); ++i) {
        for (var j = 0, carry = input.at(i); j < digits.length; ++j) {
          carry += digits[j] << 8;
          digits[j] = carry % base3;
          carry = carry / base3 | 0;
        }
        while (carry > 0) {
          digits.push(carry % base3);
          carry = carry / base3 | 0;
        }
      }
      var output = "";
      for (i = 0; input.at(i) === 0 && i < input.length() - 1; ++i) {
        output += first;
      }
      for (i = digits.length - 1; i >= 0; --i) {
        output += alphabet2[digits[i]];
      }
      return output;
    }
  }
});

// node_modules/node-forge/lib/util.js
var require_util = __commonJS({
  "node_modules/node-forge/lib/util.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    var baseN = require_baseN();
    var util = module2.exports = forge.util = forge.util || {};
    (function() {
      if (typeof process !== "undefined" && process.nextTick && !process.browser) {
        util.nextTick = process.nextTick;
        if (typeof setImmediate === "function") {
          util.setImmediate = setImmediate;
        } else {
          util.setImmediate = util.nextTick;
        }
        return;
      }
      if (typeof setImmediate === "function") {
        util.setImmediate = function() {
          return setImmediate.apply(void 0, arguments);
        };
        util.nextTick = function(callback) {
          return setImmediate(callback);
        };
        return;
      }
      util.setImmediate = function(callback) {
        setTimeout(callback, 0);
      };
      if (typeof window !== "undefined" && typeof window.postMessage === "function") {
        let handler2 = function(event) {
          if (event.source === window && event.data === msg) {
            event.stopPropagation();
            var copy = callbacks.slice();
            callbacks.length = 0;
            copy.forEach(function(callback) {
              callback();
            });
          }
        };
        var handler = handler2;
        var msg = "forge.setImmediate";
        var callbacks = [];
        util.setImmediate = function(callback) {
          callbacks.push(callback);
          if (callbacks.length === 1) {
            window.postMessage(msg, "*");
          }
        };
        window.addEventListener("message", handler2, true);
      }
      if (typeof MutationObserver !== "undefined") {
        var now = Date.now();
        var attr = true;
        var div = document.createElement("div");
        var callbacks = [];
        new MutationObserver(function() {
          var copy = callbacks.slice();
          callbacks.length = 0;
          copy.forEach(function(callback) {
            callback();
          });
        }).observe(div, { attributes: true });
        var oldSetImmediate = util.setImmediate;
        util.setImmediate = function(callback) {
          if (Date.now() - now > 15) {
            now = Date.now();
            oldSetImmediate(callback);
          } else {
            callbacks.push(callback);
            if (callbacks.length === 1) {
              div.setAttribute("a", attr = !attr);
            }
          }
        };
      }
      util.nextTick = util.setImmediate;
    })();
    util.isNodejs = typeof process !== "undefined" && process.versions && process.versions.node;
    util.globalScope = function() {
      if (util.isNodejs) {
        return global;
      }
      return typeof self === "undefined" ? window : self;
    }();
    util.isArray = Array.isArray || function(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
    util.isArrayBuffer = function(x) {
      return typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer;
    };
    util.isArrayBufferView = function(x) {
      return x && util.isArrayBuffer(x.buffer) && x.byteLength !== void 0;
    };
    function _checkBitsParam(n2) {
      if (!(n2 === 8 || n2 === 16 || n2 === 24 || n2 === 32)) {
        throw new Error("Only 8, 16, 24, or 32 bits supported: " + n2);
      }
    }
    util.ByteBuffer = ByteStringBuffer;
    function ByteStringBuffer(b2) {
      this.data = "";
      this.read = 0;
      if (typeof b2 === "string") {
        this.data = b2;
      } else if (util.isArrayBuffer(b2) || util.isArrayBufferView(b2)) {
        if (typeof Buffer !== "undefined" && b2 instanceof Buffer) {
          this.data = b2.toString("binary");
        } else {
          var arr = new Uint8Array(b2);
          try {
            this.data = String.fromCharCode.apply(null, arr);
          } catch (e2) {
            for (var i = 0; i < arr.length; ++i) {
              this.putByte(arr[i]);
            }
          }
        }
      } else if (b2 instanceof ByteStringBuffer || typeof b2 === "object" && typeof b2.data === "string" && typeof b2.read === "number") {
        this.data = b2.data;
        this.read = b2.read;
      }
      this._constructedStringLength = 0;
    }
    util.ByteStringBuffer = ByteStringBuffer;
    var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
    util.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
      this._constructedStringLength += x;
      if (this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
        this.data.substr(0, 1);
        this._constructedStringLength = 0;
      }
    };
    util.ByteStringBuffer.prototype.length = function() {
      return this.data.length - this.read;
    };
    util.ByteStringBuffer.prototype.isEmpty = function() {
      return this.length() <= 0;
    };
    util.ByteStringBuffer.prototype.putByte = function(b2) {
      return this.putBytes(String.fromCharCode(b2));
    };
    util.ByteStringBuffer.prototype.fillWithByte = function(b2, n2) {
      b2 = String.fromCharCode(b2);
      var d2 = this.data;
      while (n2 > 0) {
        if (n2 & 1) {
          d2 += b2;
        }
        n2 >>>= 1;
        if (n2 > 0) {
          b2 += b2;
        }
      }
      this.data = d2;
      this._optimizeConstructedString(n2);
      return this;
    };
    util.ByteStringBuffer.prototype.putBytes = function(bytes) {
      this.data += bytes;
      this._optimizeConstructedString(bytes.length);
      return this;
    };
    util.ByteStringBuffer.prototype.putString = function(str) {
      return this.putBytes(util.encodeUtf8(str));
    };
    util.ByteStringBuffer.prototype.putInt16 = function(i) {
      return this.putBytes(
        String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255)
      );
    };
    util.ByteStringBuffer.prototype.putInt24 = function(i) {
      return this.putBytes(
        String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255)
      );
    };
    util.ByteStringBuffer.prototype.putInt32 = function(i) {
      return this.putBytes(
        String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255)
      );
    };
    util.ByteStringBuffer.prototype.putInt16Le = function(i) {
      return this.putBytes(
        String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255)
      );
    };
    util.ByteStringBuffer.prototype.putInt24Le = function(i) {
      return this.putBytes(
        String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255)
      );
    };
    util.ByteStringBuffer.prototype.putInt32Le = function(i) {
      return this.putBytes(
        String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 24 & 255)
      );
    };
    util.ByteStringBuffer.prototype.putInt = function(i, n2) {
      _checkBitsParam(n2);
      var bytes = "";
      do {
        n2 -= 8;
        bytes += String.fromCharCode(i >> n2 & 255);
      } while (n2 > 0);
      return this.putBytes(bytes);
    };
    util.ByteStringBuffer.prototype.putSignedInt = function(i, n2) {
      if (i < 0) {
        i += 2 << n2 - 1;
      }
      return this.putInt(i, n2);
    };
    util.ByteStringBuffer.prototype.putBuffer = function(buffer2) {
      return this.putBytes(buffer2.getBytes());
    };
    util.ByteStringBuffer.prototype.getByte = function() {
      return this.data.charCodeAt(this.read++);
    };
    util.ByteStringBuffer.prototype.getInt16 = function() {
      var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
      this.read += 2;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt24 = function() {
      var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
      this.read += 3;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt32 = function() {
      var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
      this.read += 4;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt16Le = function() {
      var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
      this.read += 2;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt24Le = function() {
      var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
      this.read += 3;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt32Le = function() {
      var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
      this.read += 4;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt = function(n2) {
      _checkBitsParam(n2);
      var rval = 0;
      do {
        rval = (rval << 8) + this.data.charCodeAt(this.read++);
        n2 -= 8;
      } while (n2 > 0);
      return rval;
    };
    util.ByteStringBuffer.prototype.getSignedInt = function(n2) {
      var x = this.getInt(n2);
      var max = 2 << n2 - 2;
      if (x >= max) {
        x -= max << 1;
      }
      return x;
    };
    util.ByteStringBuffer.prototype.getBytes = function(count) {
      var rval;
      if (count) {
        count = Math.min(this.length(), count);
        rval = this.data.slice(this.read, this.read + count);
        this.read += count;
      } else if (count === 0) {
        rval = "";
      } else {
        rval = this.read === 0 ? this.data : this.data.slice(this.read);
        this.clear();
      }
      return rval;
    };
    util.ByteStringBuffer.prototype.bytes = function(count) {
      return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
    };
    util.ByteStringBuffer.prototype.at = function(i) {
      return this.data.charCodeAt(this.read + i);
    };
    util.ByteStringBuffer.prototype.setAt = function(i, b2) {
      this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b2) + this.data.substr(this.read + i + 1);
      return this;
    };
    util.ByteStringBuffer.prototype.last = function() {
      return this.data.charCodeAt(this.data.length - 1);
    };
    util.ByteStringBuffer.prototype.copy = function() {
      var c = util.createBuffer(this.data);
      c.read = this.read;
      return c;
    };
    util.ByteStringBuffer.prototype.compact = function() {
      if (this.read > 0) {
        this.data = this.data.slice(this.read);
        this.read = 0;
      }
      return this;
    };
    util.ByteStringBuffer.prototype.clear = function() {
      this.data = "";
      this.read = 0;
      return this;
    };
    util.ByteStringBuffer.prototype.truncate = function(count) {
      var len = Math.max(0, this.length() - count);
      this.data = this.data.substr(this.read, len);
      this.read = 0;
      return this;
    };
    util.ByteStringBuffer.prototype.toHex = function() {
      var rval = "";
      for (var i = this.read; i < this.data.length; ++i) {
        var b2 = this.data.charCodeAt(i);
        if (b2 < 16) {
          rval += "0";
        }
        rval += b2.toString(16);
      }
      return rval;
    };
    util.ByteStringBuffer.prototype.toString = function() {
      return util.decodeUtf8(this.bytes());
    };
    function DataBuffer(b2, options) {
      options = options || {};
      this.read = options.readOffset || 0;
      this.growSize = options.growSize || 1024;
      var isArrayBuffer = util.isArrayBuffer(b2);
      var isArrayBufferView = util.isArrayBufferView(b2);
      if (isArrayBuffer || isArrayBufferView) {
        if (isArrayBuffer) {
          this.data = new DataView(b2);
        } else {
          this.data = new DataView(b2.buffer, b2.byteOffset, b2.byteLength);
        }
        this.write = "writeOffset" in options ? options.writeOffset : this.data.byteLength;
        return;
      }
      this.data = new DataView(new ArrayBuffer(0));
      this.write = 0;
      if (b2 !== null && b2 !== void 0) {
        this.putBytes(b2);
      }
      if ("writeOffset" in options) {
        this.write = options.writeOffset;
      }
    }
    util.DataBuffer = DataBuffer;
    util.DataBuffer.prototype.length = function() {
      return this.write - this.read;
    };
    util.DataBuffer.prototype.isEmpty = function() {
      return this.length() <= 0;
    };
    util.DataBuffer.prototype.accommodate = function(amount, growSize) {
      if (this.length() >= amount) {
        return this;
      }
      growSize = Math.max(growSize || this.growSize, amount);
      var src2 = new Uint8Array(
        this.data.buffer,
        this.data.byteOffset,
        this.data.byteLength
      );
      var dst = new Uint8Array(this.length() + growSize);
      dst.set(src2);
      this.data = new DataView(dst.buffer);
      return this;
    };
    util.DataBuffer.prototype.putByte = function(b2) {
      this.accommodate(1);
      this.data.setUint8(this.write++, b2);
      return this;
    };
    util.DataBuffer.prototype.fillWithByte = function(b2, n2) {
      this.accommodate(n2);
      for (var i = 0; i < n2; ++i) {
        this.data.setUint8(b2);
      }
      return this;
    };
    util.DataBuffer.prototype.putBytes = function(bytes, encoding) {
      if (util.isArrayBufferView(bytes)) {
        var src2 = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        var len = src2.byteLength - src2.byteOffset;
        this.accommodate(len);
        var dst = new Uint8Array(this.data.buffer, this.write);
        dst.set(src2);
        this.write += len;
        return this;
      }
      if (util.isArrayBuffer(bytes)) {
        var src2 = new Uint8Array(bytes);
        this.accommodate(src2.byteLength);
        var dst = new Uint8Array(this.data.buffer);
        dst.set(src2, this.write);
        this.write += src2.byteLength;
        return this;
      }
      if (bytes instanceof util.DataBuffer || typeof bytes === "object" && typeof bytes.read === "number" && typeof bytes.write === "number" && util.isArrayBufferView(bytes.data)) {
        var src2 = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
        this.accommodate(src2.byteLength);
        var dst = new Uint8Array(bytes.data.byteLength, this.write);
        dst.set(src2);
        this.write += src2.byteLength;
        return this;
      }
      if (bytes instanceof util.ByteStringBuffer) {
        bytes = bytes.data;
        encoding = "binary";
      }
      encoding = encoding || "binary";
      if (typeof bytes === "string") {
        var view;
        if (encoding === "hex") {
          this.accommodate(Math.ceil(bytes.length / 2));
          view = new Uint8Array(this.data.buffer, this.write);
          this.write += util.binary.hex.decode(bytes, view, this.write);
          return this;
        }
        if (encoding === "base64") {
          this.accommodate(Math.ceil(bytes.length / 4) * 3);
          view = new Uint8Array(this.data.buffer, this.write);
          this.write += util.binary.base64.decode(bytes, view, this.write);
          return this;
        }
        if (encoding === "utf8") {
          bytes = util.encodeUtf8(bytes);
          encoding = "binary";
        }
        if (encoding === "binary" || encoding === "raw") {
          this.accommodate(bytes.length);
          view = new Uint8Array(this.data.buffer, this.write);
          this.write += util.binary.raw.decode(view);
          return this;
        }
        if (encoding === "utf16") {
          this.accommodate(bytes.length * 2);
          view = new Uint16Array(this.data.buffer, this.write);
          this.write += util.text.utf16.encode(view);
          return this;
        }
        throw new Error("Invalid encoding: " + encoding);
      }
      throw Error("Invalid parameter: " + bytes);
    };
    util.DataBuffer.prototype.putBuffer = function(buffer2) {
      this.putBytes(buffer2);
      buffer2.clear();
      return this;
    };
    util.DataBuffer.prototype.putString = function(str) {
      return this.putBytes(str, "utf16");
    };
    util.DataBuffer.prototype.putInt16 = function(i) {
      this.accommodate(2);
      this.data.setInt16(this.write, i);
      this.write += 2;
      return this;
    };
    util.DataBuffer.prototype.putInt24 = function(i) {
      this.accommodate(3);
      this.data.setInt16(this.write, i >> 8 & 65535);
      this.data.setInt8(this.write, i >> 16 & 255);
      this.write += 3;
      return this;
    };
    util.DataBuffer.prototype.putInt32 = function(i) {
      this.accommodate(4);
      this.data.setInt32(this.write, i);
      this.write += 4;
      return this;
    };
    util.DataBuffer.prototype.putInt16Le = function(i) {
      this.accommodate(2);
      this.data.setInt16(this.write, i, true);
      this.write += 2;
      return this;
    };
    util.DataBuffer.prototype.putInt24Le = function(i) {
      this.accommodate(3);
      this.data.setInt8(this.write, i >> 16 & 255);
      this.data.setInt16(this.write, i >> 8 & 65535, true);
      this.write += 3;
      return this;
    };
    util.DataBuffer.prototype.putInt32Le = function(i) {
      this.accommodate(4);
      this.data.setInt32(this.write, i, true);
      this.write += 4;
      return this;
    };
    util.DataBuffer.prototype.putInt = function(i, n2) {
      _checkBitsParam(n2);
      this.accommodate(n2 / 8);
      do {
        n2 -= 8;
        this.data.setInt8(this.write++, i >> n2 & 255);
      } while (n2 > 0);
      return this;
    };
    util.DataBuffer.prototype.putSignedInt = function(i, n2) {
      _checkBitsParam(n2);
      this.accommodate(n2 / 8);
      if (i < 0) {
        i += 2 << n2 - 1;
      }
      return this.putInt(i, n2);
    };
    util.DataBuffer.prototype.getByte = function() {
      return this.data.getInt8(this.read++);
    };
    util.DataBuffer.prototype.getInt16 = function() {
      var rval = this.data.getInt16(this.read);
      this.read += 2;
      return rval;
    };
    util.DataBuffer.prototype.getInt24 = function() {
      var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
      this.read += 3;
      return rval;
    };
    util.DataBuffer.prototype.getInt32 = function() {
      var rval = this.data.getInt32(this.read);
      this.read += 4;
      return rval;
    };
    util.DataBuffer.prototype.getInt16Le = function() {
      var rval = this.data.getInt16(this.read, true);
      this.read += 2;
      return rval;
    };
    util.DataBuffer.prototype.getInt24Le = function() {
      var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8;
      this.read += 3;
      return rval;
    };
    util.DataBuffer.prototype.getInt32Le = function() {
      var rval = this.data.getInt32(this.read, true);
      this.read += 4;
      return rval;
    };
    util.DataBuffer.prototype.getInt = function(n2) {
      _checkBitsParam(n2);
      var rval = 0;
      do {
        rval = (rval << 8) + this.data.getInt8(this.read++);
        n2 -= 8;
      } while (n2 > 0);
      return rval;
    };
    util.DataBuffer.prototype.getSignedInt = function(n2) {
      var x = this.getInt(n2);
      var max = 2 << n2 - 2;
      if (x >= max) {
        x -= max << 1;
      }
      return x;
    };
    util.DataBuffer.prototype.getBytes = function(count) {
      var rval;
      if (count) {
        count = Math.min(this.length(), count);
        rval = this.data.slice(this.read, this.read + count);
        this.read += count;
      } else if (count === 0) {
        rval = "";
      } else {
        rval = this.read === 0 ? this.data : this.data.slice(this.read);
        this.clear();
      }
      return rval;
    };
    util.DataBuffer.prototype.bytes = function(count) {
      return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
    };
    util.DataBuffer.prototype.at = function(i) {
      return this.data.getUint8(this.read + i);
    };
    util.DataBuffer.prototype.setAt = function(i, b2) {
      this.data.setUint8(i, b2);
      return this;
    };
    util.DataBuffer.prototype.last = function() {
      return this.data.getUint8(this.write - 1);
    };
    util.DataBuffer.prototype.copy = function() {
      return new util.DataBuffer(this);
    };
    util.DataBuffer.prototype.compact = function() {
      if (this.read > 0) {
        var src2 = new Uint8Array(this.data.buffer, this.read);
        var dst = new Uint8Array(src2.byteLength);
        dst.set(src2);
        this.data = new DataView(dst);
        this.write -= this.read;
        this.read = 0;
      }
      return this;
    };
    util.DataBuffer.prototype.clear = function() {
      this.data = new DataView(new ArrayBuffer(0));
      this.read = this.write = 0;
      return this;
    };
    util.DataBuffer.prototype.truncate = function(count) {
      this.write = Math.max(0, this.length() - count);
      this.read = Math.min(this.read, this.write);
      return this;
    };
    util.DataBuffer.prototype.toHex = function() {
      var rval = "";
      for (var i = this.read; i < this.data.byteLength; ++i) {
        var b2 = this.data.getUint8(i);
        if (b2 < 16) {
          rval += "0";
        }
        rval += b2.toString(16);
      }
      return rval;
    };
    util.DataBuffer.prototype.toString = function(encoding) {
      var view = new Uint8Array(this.data, this.read, this.length());
      encoding = encoding || "utf8";
      if (encoding === "binary" || encoding === "raw") {
        return util.binary.raw.encode(view);
      }
      if (encoding === "hex") {
        return util.binary.hex.encode(view);
      }
      if (encoding === "base64") {
        return util.binary.base64.encode(view);
      }
      if (encoding === "utf8") {
        return util.text.utf8.decode(view);
      }
      if (encoding === "utf16") {
        return util.text.utf16.decode(view);
      }
      throw new Error("Invalid encoding: " + encoding);
    };
    util.createBuffer = function(input, encoding) {
      encoding = encoding || "raw";
      if (input !== void 0 && encoding === "utf8") {
        input = util.encodeUtf8(input);
      }
      return new util.ByteBuffer(input);
    };
    util.fillString = function(c, n2) {
      var s = "";
      while (n2 > 0) {
        if (n2 & 1) {
          s += c;
        }
        n2 >>>= 1;
        if (n2 > 0) {
          c += c;
        }
      }
      return s;
    };
    util.xorBytes = function(s1, s2, n2) {
      var s3 = "";
      var b2 = "";
      var t2 = "";
      var i = 0;
      var c = 0;
      for (; n2 > 0; --n2, ++i) {
        b2 = s1.charCodeAt(i) ^ s2.charCodeAt(i);
        if (c >= 10) {
          s3 += t2;
          t2 = "";
          c = 0;
        }
        t2 += String.fromCharCode(b2);
        ++c;
      }
      s3 += t2;
      return s3;
    };
    util.hexToBytes = function(hex) {
      var rval = "";
      var i = 0;
      if (hex.length & true) {
        i = 1;
        rval += String.fromCharCode(parseInt(hex[0], 16));
      }
      for (; i < hex.length; i += 2) {
        rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return rval;
    };
    util.bytesToHex = function(bytes) {
      return util.createBuffer(bytes).toHex();
    };
    util.int32ToBytes = function(i) {
      return String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
    };
    var _base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var _base64Idx = [
      /*43 -43 = 0*/
      /*'+',  1,  2,  3,'/' */
      62,
      -1,
      -1,
      -1,
      63,
      /*'0','1','2','3','4','5','6','7','8','9' */
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      /*15, 16, 17,'=', 19, 20, 21 */
      -1,
      -1,
      -1,
      64,
      -1,
      -1,
      -1,
      /*65 - 43 = 22*/
      /*'A','B','C','D','E','F','G','H','I','J','K','L','M', */
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      /*'N','O','P','Q','R','S','T','U','V','W','X','Y','Z' */
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      /*91 - 43 = 48 */
      /*48, 49, 50, 51, 52, 53 */
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      /*97 - 43 = 54*/
      /*'a','b','c','d','e','f','g','h','i','j','k','l','m' */
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      /*'n','o','p','q','r','s','t','u','v','w','x','y','z' */
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51
    ];
    var _base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    util.encode64 = function(input, maxline) {
      var line = "";
      var output = "";
      var chr1, chr2, chr3;
      var i = 0;
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        line += _base64.charAt(chr1 >> 2);
        line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
        if (isNaN(chr2)) {
          line += "==";
        } else {
          line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
          line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
        }
        if (maxline && line.length > maxline) {
          output += line.substr(0, maxline) + "\r\n";
          line = line.substr(maxline);
        }
      }
      output += line;
      return output;
    };
    util.decode64 = function(input) {
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      var output = "";
      var enc1, enc2, enc3, enc4;
      var i = 0;
      while (i < input.length) {
        enc1 = _base64Idx[input.charCodeAt(i++) - 43];
        enc2 = _base64Idx[input.charCodeAt(i++) - 43];
        enc3 = _base64Idx[input.charCodeAt(i++) - 43];
        enc4 = _base64Idx[input.charCodeAt(i++) - 43];
        output += String.fromCharCode(enc1 << 2 | enc2 >> 4);
        if (enc3 !== 64) {
          output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2);
          if (enc4 !== 64) {
            output += String.fromCharCode((enc3 & 3) << 6 | enc4);
          }
        }
      }
      return output;
    };
    util.encodeUtf8 = function(str) {
      return unescape(encodeURIComponent(str));
    };
    util.decodeUtf8 = function(str) {
      return decodeURIComponent(escape(str));
    };
    util.binary = {
      raw: {},
      hex: {},
      base64: {},
      base58: {},
      baseN: {
        encode: baseN.encode,
        decode: baseN.decode
      }
    };
    util.binary.raw.encode = function(bytes) {
      return String.fromCharCode.apply(null, bytes);
    };
    util.binary.raw.decode = function(str, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(str.length);
      }
      offset = offset || 0;
      var j = offset;
      for (var i = 0; i < str.length; ++i) {
        out[j++] = str.charCodeAt(i);
      }
      return output ? j - offset : out;
    };
    util.binary.hex.encode = util.bytesToHex;
    util.binary.hex.decode = function(hex, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(Math.ceil(hex.length / 2));
      }
      offset = offset || 0;
      var i = 0, j = offset;
      if (hex.length & 1) {
        i = 1;
        out[j++] = parseInt(hex[0], 16);
      }
      for (; i < hex.length; i += 2) {
        out[j++] = parseInt(hex.substr(i, 2), 16);
      }
      return output ? j - offset : out;
    };
    util.binary.base64.encode = function(input, maxline) {
      var line = "";
      var output = "";
      var chr1, chr2, chr3;
      var i = 0;
      while (i < input.byteLength) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        line += _base64.charAt(chr1 >> 2);
        line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
        if (isNaN(chr2)) {
          line += "==";
        } else {
          line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
          line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
        }
        if (maxline && line.length > maxline) {
          output += line.substr(0, maxline) + "\r\n";
          line = line.substr(maxline);
        }
      }
      output += line;
      return output;
    };
    util.binary.base64.decode = function(input, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(Math.ceil(input.length / 4) * 3);
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      offset = offset || 0;
      var enc1, enc2, enc3, enc4;
      var i = 0, j = offset;
      while (i < input.length) {
        enc1 = _base64Idx[input.charCodeAt(i++) - 43];
        enc2 = _base64Idx[input.charCodeAt(i++) - 43];
        enc3 = _base64Idx[input.charCodeAt(i++) - 43];
        enc4 = _base64Idx[input.charCodeAt(i++) - 43];
        out[j++] = enc1 << 2 | enc2 >> 4;
        if (enc3 !== 64) {
          out[j++] = (enc2 & 15) << 4 | enc3 >> 2;
          if (enc4 !== 64) {
            out[j++] = (enc3 & 3) << 6 | enc4;
          }
        }
      }
      return output ? j - offset : out.subarray(0, j);
    };
    util.binary.base58.encode = function(input, maxline) {
      return util.binary.baseN.encode(input, _base58, maxline);
    };
    util.binary.base58.decode = function(input, maxline) {
      return util.binary.baseN.decode(input, _base58, maxline);
    };
    util.text = {
      utf8: {},
      utf16: {}
    };
    util.text.utf8.encode = function(str, output, offset) {
      str = util.encodeUtf8(str);
      var out = output;
      if (!out) {
        out = new Uint8Array(str.length);
      }
      offset = offset || 0;
      var j = offset;
      for (var i = 0; i < str.length; ++i) {
        out[j++] = str.charCodeAt(i);
      }
      return output ? j - offset : out;
    };
    util.text.utf8.decode = function(bytes) {
      return util.decodeUtf8(String.fromCharCode.apply(null, bytes));
    };
    util.text.utf16.encode = function(str, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(str.length * 2);
      }
      var view = new Uint16Array(out.buffer);
      offset = offset || 0;
      var j = offset;
      var k = offset;
      for (var i = 0; i < str.length; ++i) {
        view[k++] = str.charCodeAt(i);
        j += 2;
      }
      return output ? j - offset : out;
    };
    util.text.utf16.decode = function(bytes) {
      return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
    };
    util.deflate = function(api, bytes, raw) {
      bytes = util.decode64(api.deflate(util.encode64(bytes)).rval);
      if (raw) {
        var start = 2;
        var flg = bytes.charCodeAt(1);
        if (flg & 32) {
          start = 6;
        }
        bytes = bytes.substring(start, bytes.length - 4);
      }
      return bytes;
    };
    util.inflate = function(api, bytes, raw) {
      var rval = api.inflate(util.encode64(bytes)).rval;
      return rval === null ? null : util.decode64(rval);
    };
    var _setStorageObject = function(api, id, obj) {
      if (!api) {
        throw new Error("WebStorage not available.");
      }
      var rval;
      if (obj === null) {
        rval = api.removeItem(id);
      } else {
        obj = util.encode64(JSON.stringify(obj));
        rval = api.setItem(id, obj);
      }
      if (typeof rval !== "undefined" && rval.rval !== true) {
        var error = new Error(rval.error.message);
        error.id = rval.error.id;
        error.name = rval.error.name;
        throw error;
      }
    };
    var _getStorageObject = function(api, id) {
      if (!api) {
        throw new Error("WebStorage not available.");
      }
      var rval = api.getItem(id);
      if (api.init) {
        if (rval.rval === null) {
          if (rval.error) {
            var error = new Error(rval.error.message);
            error.id = rval.error.id;
            error.name = rval.error.name;
            throw error;
          }
          rval = null;
        } else {
          rval = rval.rval;
        }
      }
      if (rval !== null) {
        rval = JSON.parse(util.decode64(rval));
      }
      return rval;
    };
    var _setItem = function(api, id, key, data) {
      var obj = _getStorageObject(api, id);
      if (obj === null) {
        obj = {};
      }
      obj[key] = data;
      _setStorageObject(api, id, obj);
    };
    var _getItem = function(api, id, key) {
      var rval = _getStorageObject(api, id);
      if (rval !== null) {
        rval = key in rval ? rval[key] : null;
      }
      return rval;
    };
    var _removeItem = function(api, id, key) {
      var obj = _getStorageObject(api, id);
      if (obj !== null && key in obj) {
        delete obj[key];
        var empty2 = true;
        for (var prop in obj) {
          empty2 = false;
          break;
        }
        if (empty2) {
          obj = null;
        }
        _setStorageObject(api, id, obj);
      }
    };
    var _clearItems = function(api, id) {
      _setStorageObject(api, id, null);
    };
    var _callStorageFunction = function(func, args, location) {
      var rval = null;
      if (typeof location === "undefined") {
        location = ["web", "flash"];
      }
      var type;
      var done = false;
      var exception = null;
      for (var idx in location) {
        type = location[idx];
        try {
          if (type === "flash" || type === "both") {
            if (args[0] === null) {
              throw new Error("Flash local storage not available.");
            }
            rval = func.apply(this, args);
            done = type === "flash";
          }
          if (type === "web" || type === "both") {
            args[0] = localStorage;
            rval = func.apply(this, args);
            done = true;
          }
        } catch (ex) {
          exception = ex;
        }
        if (done) {
          break;
        }
      }
      if (!done) {
        throw exception;
      }
      return rval;
    };
    util.setItem = function(api, id, key, data, location) {
      _callStorageFunction(_setItem, arguments, location);
    };
    util.getItem = function(api, id, key, location) {
      return _callStorageFunction(_getItem, arguments, location);
    };
    util.removeItem = function(api, id, key, location) {
      _callStorageFunction(_removeItem, arguments, location);
    };
    util.clearItems = function(api, id, location) {
      _callStorageFunction(_clearItems, arguments, location);
    };
    util.isEmpty = function(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return true;
    };
    util.format = function(format) {
      var re = /%./g;
      var match;
      var part;
      var argi = 0;
      var parts = [];
      var last = 0;
      while (match = re.exec(format)) {
        part = format.substring(last, re.lastIndex - 2);
        if (part.length > 0) {
          parts.push(part);
        }
        last = re.lastIndex;
        var code2 = match[0][1];
        switch (code2) {
          case "s":
          case "o":
            if (argi < arguments.length) {
              parts.push(arguments[argi++ + 1]);
            } else {
              parts.push("<?>");
            }
            break;
          // FIXME: do proper formating for numbers, etc
          //case 'f':
          //case 'd':
          case "%":
            parts.push("%");
            break;
          default:
            parts.push("<%" + code2 + "?>");
        }
      }
      parts.push(format.substring(last));
      return parts.join("");
    };
    util.formatNumber = function(number, decimals, dec_point, thousands_sep) {
      var n2 = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
      var d2 = dec_point === void 0 ? "," : dec_point;
      var t2 = thousands_sep === void 0 ? "." : thousands_sep, s = n2 < 0 ? "-" : "";
      var i = parseInt(n2 = Math.abs(+n2 || 0).toFixed(c), 10) + "";
      var j = i.length > 3 ? i.length % 3 : 0;
      return s + (j ? i.substr(0, j) + t2 : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t2) + (c ? d2 + Math.abs(n2 - i).toFixed(c).slice(2) : "");
    };
    util.formatSize = function(size) {
      if (size >= 1073741824) {
        size = util.formatNumber(size / 1073741824, 2, ".", "") + " GiB";
      } else if (size >= 1048576) {
        size = util.formatNumber(size / 1048576, 2, ".", "") + " MiB";
      } else if (size >= 1024) {
        size = util.formatNumber(size / 1024, 0) + " KiB";
      } else {
        size = util.formatNumber(size, 0) + " bytes";
      }
      return size;
    };
    util.bytesFromIP = function(ip) {
      if (ip.indexOf(".") !== -1) {
        return util.bytesFromIPv4(ip);
      }
      if (ip.indexOf(":") !== -1) {
        return util.bytesFromIPv6(ip);
      }
      return null;
    };
    util.bytesFromIPv4 = function(ip) {
      ip = ip.split(".");
      if (ip.length !== 4) {
        return null;
      }
      var b2 = util.createBuffer();
      for (var i = 0; i < ip.length; ++i) {
        var num = parseInt(ip[i], 10);
        if (isNaN(num)) {
          return null;
        }
        b2.putByte(num);
      }
      return b2.getBytes();
    };
    util.bytesFromIPv6 = function(ip) {
      var blanks = 0;
      ip = ip.split(":").filter(function(e2) {
        if (e2.length === 0) ++blanks;
        return true;
      });
      var zeros = (8 - ip.length + blanks) * 2;
      var b2 = util.createBuffer();
      for (var i = 0; i < 8; ++i) {
        if (!ip[i] || ip[i].length === 0) {
          b2.fillWithByte(0, zeros);
          zeros = 0;
          continue;
        }
        var bytes = util.hexToBytes(ip[i]);
        if (bytes.length < 2) {
          b2.putByte(0);
        }
        b2.putBytes(bytes);
      }
      return b2.getBytes();
    };
    util.bytesToIP = function(bytes) {
      if (bytes.length === 4) {
        return util.bytesToIPv4(bytes);
      }
      if (bytes.length === 16) {
        return util.bytesToIPv6(bytes);
      }
      return null;
    };
    util.bytesToIPv4 = function(bytes) {
      if (bytes.length !== 4) {
        return null;
      }
      var ip = [];
      for (var i = 0; i < bytes.length; ++i) {
        ip.push(bytes.charCodeAt(i));
      }
      return ip.join(".");
    };
    util.bytesToIPv6 = function(bytes) {
      if (bytes.length !== 16) {
        return null;
      }
      var ip = [];
      var zeroGroups = [];
      var zeroMaxGroup = 0;
      for (var i = 0; i < bytes.length; i += 2) {
        var hex = util.bytesToHex(bytes[i] + bytes[i + 1]);
        while (hex[0] === "0" && hex !== "0") {
          hex = hex.substr(1);
        }
        if (hex === "0") {
          var last = zeroGroups[zeroGroups.length - 1];
          var idx = ip.length;
          if (!last || idx !== last.end + 1) {
            zeroGroups.push({ start: idx, end: idx });
          } else {
            last.end = idx;
            if (last.end - last.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start) {
              zeroMaxGroup = zeroGroups.length - 1;
            }
          }
        }
        ip.push(hex);
      }
      if (zeroGroups.length > 0) {
        var group = zeroGroups[zeroMaxGroup];
        if (group.end - group.start > 0) {
          ip.splice(group.start, group.end - group.start + 1, "");
          if (group.start === 0) {
            ip.unshift("");
          }
          if (group.end === 7) {
            ip.push("");
          }
        }
      }
      return ip.join(":");
    };
    util.estimateCores = function(options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options = options || {};
      if ("cores" in util && !options.update) {
        return callback(null, util.cores);
      }
      if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) {
        util.cores = navigator.hardwareConcurrency;
        return callback(null, util.cores);
      }
      if (typeof Worker === "undefined") {
        util.cores = 1;
        return callback(null, util.cores);
      }
      if (typeof Blob === "undefined") {
        util.cores = 2;
        return callback(null, util.cores);
      }
      var blobUrl = URL.createObjectURL(new Blob([
        "(",
        function() {
          self.addEventListener("message", function(e2) {
            var st = Date.now();
            var et = st + 4;
            while (Date.now() < et) ;
            self.postMessage({ st, et });
          });
        }.toString(),
        ")()"
      ], { type: "application/javascript" }));
      sample([], 5, 16);
      function sample(max, samples, numWorkers) {
        if (samples === 0) {
          var avg = Math.floor(max.reduce(function(avg2, x) {
            return avg2 + x;
          }, 0) / max.length);
          util.cores = Math.max(1, avg);
          URL.revokeObjectURL(blobUrl);
          return callback(null, util.cores);
        }
        map(numWorkers, function(err, results) {
          max.push(reduce(numWorkers, results));
          sample(max, samples - 1, numWorkers);
        });
      }
      function map(numWorkers, callback2) {
        var workers = [];
        var results = [];
        for (var i = 0; i < numWorkers; ++i) {
          var worker = new Worker(blobUrl);
          worker.addEventListener("message", function(e2) {
            results.push(e2.data);
            if (results.length === numWorkers) {
              for (var i2 = 0; i2 < numWorkers; ++i2) {
                workers[i2].terminate();
              }
              callback2(null, results);
            }
          });
          workers.push(worker);
        }
        for (var i = 0; i < numWorkers; ++i) {
          workers[i].postMessage(i);
        }
      }
      function reduce(numWorkers, results) {
        var overlaps = [];
        for (var n2 = 0; n2 < numWorkers; ++n2) {
          var r1 = results[n2];
          var overlap = overlaps[n2] = [];
          for (var i = 0; i < numWorkers; ++i) {
            if (n2 === i) {
              continue;
            }
            var r2 = results[i];
            if (r1.st > r2.st && r1.st < r2.et || r2.st > r1.st && r2.st < r1.et) {
              overlap.push(i);
            }
          }
        }
        return overlaps.reduce(function(max, overlap2) {
          return Math.max(max, overlap2.length);
        }, 0);
      }
    };
  }
});

// node_modules/node-forge/lib/cipher.js
var require_cipher = __commonJS({
  "node_modules/node-forge/lib/cipher.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    module2.exports = forge.cipher = forge.cipher || {};
    forge.cipher.algorithms = forge.cipher.algorithms || {};
    forge.cipher.createCipher = function(algorithm, key) {
      var api = algorithm;
      if (typeof api === "string") {
        api = forge.cipher.getAlgorithm(api);
        if (api) {
          api = api();
        }
      }
      if (!api) {
        throw new Error("Unsupported algorithm: " + algorithm);
      }
      return new forge.cipher.BlockCipher({
        algorithm: api,
        key,
        decrypt: false
      });
    };
    forge.cipher.createDecipher = function(algorithm, key) {
      var api = algorithm;
      if (typeof api === "string") {
        api = forge.cipher.getAlgorithm(api);
        if (api) {
          api = api();
        }
      }
      if (!api) {
        throw new Error("Unsupported algorithm: " + algorithm);
      }
      return new forge.cipher.BlockCipher({
        algorithm: api,
        key,
        decrypt: true
      });
    };
    forge.cipher.registerAlgorithm = function(name2, algorithm) {
      name2 = name2.toUpperCase();
      forge.cipher.algorithms[name2] = algorithm;
    };
    forge.cipher.getAlgorithm = function(name2) {
      name2 = name2.toUpperCase();
      if (name2 in forge.cipher.algorithms) {
        return forge.cipher.algorithms[name2];
      }
      return null;
    };
    var BlockCipher = forge.cipher.BlockCipher = function(options) {
      this.algorithm = options.algorithm;
      this.mode = this.algorithm.mode;
      this.blockSize = this.mode.blockSize;
      this._finish = false;
      this._input = null;
      this.output = null;
      this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt;
      this._decrypt = options.decrypt;
      this.algorithm.initialize(options);
    };
    BlockCipher.prototype.start = function(options) {
      options = options || {};
      var opts = {};
      for (var key in options) {
        opts[key] = options[key];
      }
      opts.decrypt = this._decrypt;
      this._finish = false;
      this._input = forge.util.createBuffer();
      this.output = options.output || forge.util.createBuffer();
      this.mode.start(opts);
    };
    BlockCipher.prototype.update = function(input) {
      if (input) {
        this._input.putBuffer(input);
      }
      while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish) {
      }
      this._input.compact();
    };
    BlockCipher.prototype.finish = function(pad) {
      if (pad && (this.mode.name === "ECB" || this.mode.name === "CBC")) {
        this.mode.pad = function(input) {
          return pad(this.blockSize, input, false);
        };
        this.mode.unpad = function(output) {
          return pad(this.blockSize, output, true);
        };
      }
      var options = {};
      options.decrypt = this._decrypt;
      options.overflow = this._input.length() % this.blockSize;
      if (!this._decrypt && this.mode.pad) {
        if (!this.mode.pad(this._input, options)) {
          return false;
        }
      }
      this._finish = true;
      this.update();
      if (this._decrypt && this.mode.unpad) {
        if (!this.mode.unpad(this.output, options)) {
          return false;
        }
      }
      if (this.mode.afterFinish) {
        if (!this.mode.afterFinish(this.output, options)) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/node-forge/lib/cipherModes.js
var require_cipherModes = __commonJS({
  "node_modules/node-forge/lib/cipherModes.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    forge.cipher = forge.cipher || {};
    var modes = module2.exports = forge.cipher.modes = forge.cipher.modes || {};
    modes.ecb = function(options) {
      options = options || {};
      this.name = "ECB";
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = new Array(this._ints);
      this._outBlock = new Array(this._ints);
    };
    modes.ecb.prototype.start = function(options) {
    };
    modes.ecb.prototype.encrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32();
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i]);
      }
    };
    modes.ecb.prototype.decrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32();
      }
      this.cipher.decrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i]);
      }
    };
    modes.ecb.prototype.pad = function(input, options) {
      var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
      input.fillWithByte(padding, padding);
      return true;
    };
    modes.ecb.prototype.unpad = function(output, options) {
      if (options.overflow > 0) {
        return false;
      }
      var len = output.length();
      var count = output.at(len - 1);
      if (count > this.blockSize << 2) {
        return false;
      }
      output.truncate(count);
      return true;
    };
    modes.cbc = function(options) {
      options = options || {};
      this.name = "CBC";
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = new Array(this._ints);
      this._outBlock = new Array(this._ints);
    };
    modes.cbc.prototype.start = function(options) {
      if (options.iv === null) {
        if (!this._prev) {
          throw new Error("Invalid IV parameter.");
        }
        this._iv = this._prev.slice(0);
      } else if (!("iv" in options)) {
        throw new Error("Invalid IV parameter.");
      } else {
        this._iv = transformIV(options.iv, this.blockSize);
        this._prev = this._iv.slice(0);
      }
    };
    modes.cbc.prototype.encrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = this._prev[i] ^ input.getInt32();
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i]);
      }
      this._prev = this._outBlock;
    };
    modes.cbc.prototype.decrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32();
      }
      this.cipher.decrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._prev[i] ^ this._outBlock[i]);
      }
      this._prev = this._inBlock.slice(0);
    };
    modes.cbc.prototype.pad = function(input, options) {
      var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
      input.fillWithByte(padding, padding);
      return true;
    };
    modes.cbc.prototype.unpad = function(output, options) {
      if (options.overflow > 0) {
        return false;
      }
      var len = output.length();
      var count = output.at(len - 1);
      if (count > this.blockSize << 2) {
        return false;
      }
      output.truncate(count);
      return true;
    };
    modes.cfb = function(options) {
      options = options || {};
      this.name = "CFB";
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = null;
      this._outBlock = new Array(this._ints);
      this._partialBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
    };
    modes.cfb.prototype.start = function(options) {
      if (!("iv" in options)) {
        throw new Error("Invalid IV parameter.");
      }
      this._iv = transformIV(options.iv, this.blockSize);
      this._inBlock = this._iv.slice(0);
      this._partialBytes = 0;
    };
    modes.cfb.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32() ^ this._outBlock[i];
          output.putInt32(this._inBlock[i]);
        }
        return;
      }
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialBlock[i] = input.getInt32() ^ this._outBlock[i];
        this._partialOutput.putInt32(this._partialBlock[i]);
      }
      if (partialBytes > 0) {
        input.read -= this.blockSize;
      } else {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._partialBlock[i];
        }
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(
          partialBytes - this._partialBytes
        ));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(
        inputLength - this._partialBytes
      ));
      this._partialBytes = 0;
    };
    modes.cfb.prototype.decrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
          output.putInt32(this._inBlock[i] ^ this._outBlock[i]);
        }
        return;
      }
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialBlock[i] = input.getInt32();
        this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
      }
      if (partialBytes > 0) {
        input.read -= this.blockSize;
      } else {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._partialBlock[i];
        }
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(
          partialBytes - this._partialBytes
        ));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(
        inputLength - this._partialBytes
      ));
      this._partialBytes = 0;
    };
    modes.ofb = function(options) {
      options = options || {};
      this.name = "OFB";
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = null;
      this._outBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
    };
    modes.ofb.prototype.start = function(options) {
      if (!("iv" in options)) {
        throw new Error("Invalid IV parameter.");
      }
      this._iv = transformIV(options.iv, this.blockSize);
      this._inBlock = this._iv.slice(0);
      this._partialBytes = 0;
    };
    modes.ofb.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (input.length() === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(input.getInt32() ^ this._outBlock[i]);
          this._inBlock[i] = this._outBlock[i];
        }
        return;
      }
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
      }
      if (partialBytes > 0) {
        input.read -= this.blockSize;
      } else {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._outBlock[i];
        }
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(
          partialBytes - this._partialBytes
        ));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(
        inputLength - this._partialBytes
      ));
      this._partialBytes = 0;
    };
    modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
    modes.ctr = function(options) {
      options = options || {};
      this.name = "CTR";
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = null;
      this._outBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
    };
    modes.ctr.prototype.start = function(options) {
      if (!("iv" in options)) {
        throw new Error("Invalid IV parameter.");
      }
      this._iv = transformIV(options.iv, this.blockSize);
      this._inBlock = this._iv.slice(0);
      this._partialBytes = 0;
    };
    modes.ctr.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
      } else {
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(
            partialBytes - this._partialBytes
          ));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(
          inputLength - this._partialBytes
        ));
        this._partialBytes = 0;
      }
      inc32(this._inBlock);
    };
    modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
    modes.gcm = function(options) {
      options = options || {};
      this.name = "GCM";
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = new Array(this._ints);
      this._outBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
      this._R = 3774873600;
    };
    modes.gcm.prototype.start = function(options) {
      if (!("iv" in options)) {
        throw new Error("Invalid IV parameter.");
      }
      var iv = forge.util.createBuffer(options.iv);
      this._cipherLength = 0;
      var additionalData;
      if ("additionalData" in options) {
        additionalData = forge.util.createBuffer(options.additionalData);
      } else {
        additionalData = forge.util.createBuffer();
      }
      if ("tagLength" in options) {
        this._tagLength = options.tagLength;
      } else {
        this._tagLength = 128;
      }
      this._tag = null;
      if (options.decrypt) {
        this._tag = forge.util.createBuffer(options.tag).getBytes();
        if (this._tag.length !== this._tagLength / 8) {
          throw new Error("Authentication tag does not match tag length.");
        }
      }
      this._hashBlock = new Array(this._ints);
      this.tag = null;
      this._hashSubkey = new Array(this._ints);
      this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey);
      this.componentBits = 4;
      this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
      var ivLength = iv.length();
      if (ivLength === 12) {
        this._j0 = [iv.getInt32(), iv.getInt32(), iv.getInt32(), 1];
      } else {
        this._j0 = [0, 0, 0, 0];
        while (iv.length() > 0) {
          this._j0 = this.ghash(
            this._hashSubkey,
            this._j0,
            [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()]
          );
        }
        this._j0 = this.ghash(
          this._hashSubkey,
          this._j0,
          [0, 0].concat(from64To32(ivLength * 8))
        );
      }
      this._inBlock = this._j0.slice(0);
      inc32(this._inBlock);
      this._partialBytes = 0;
      additionalData = forge.util.createBuffer(additionalData);
      this._aDataLength = from64To32(additionalData.length() * 8);
      var overflow = additionalData.length() % this.blockSize;
      if (overflow) {
        additionalData.fillWithByte(0, this.blockSize - overflow);
      }
      this._s = [0, 0, 0, 0];
      while (additionalData.length() > 0) {
        this._s = this.ghash(this._hashSubkey, this._s, [
          additionalData.getInt32(),
          additionalData.getInt32(),
          additionalData.getInt32(),
          additionalData.getInt32()
        ]);
      }
    };
    modes.gcm.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i] ^= input.getInt32());
        }
        this._cipherLength += this.blockSize;
      } else {
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
        if (partialBytes <= 0 || finish) {
          if (finish) {
            var overflow = inputLength % this.blockSize;
            this._cipherLength += overflow;
            this._partialOutput.truncate(this.blockSize - overflow);
          } else {
            this._cipherLength += this.blockSize;
          }
          for (var i = 0; i < this._ints; ++i) {
            this._outBlock[i] = this._partialOutput.getInt32();
          }
          this._partialOutput.read -= this.blockSize;
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          input.read -= this.blockSize;
          output.putBytes(this._partialOutput.getBytes(
            partialBytes - this._partialBytes
          ));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(
          inputLength - this._partialBytes
        ));
        this._partialBytes = 0;
      }
      this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
      inc32(this._inBlock);
    };
    modes.gcm.prototype.decrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength < this.blockSize && !(finish && inputLength > 0)) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      inc32(this._inBlock);
      this._hashBlock[0] = input.getInt32();
      this._hashBlock[1] = input.getInt32();
      this._hashBlock[2] = input.getInt32();
      this._hashBlock[3] = input.getInt32();
      this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
      }
      if (inputLength < this.blockSize) {
        this._cipherLength += inputLength % this.blockSize;
      } else {
        this._cipherLength += this.blockSize;
      }
    };
    modes.gcm.prototype.afterFinish = function(output, options) {
      var rval = true;
      if (options.decrypt && options.overflow) {
        output.truncate(this.blockSize - options.overflow);
      }
      this.tag = forge.util.createBuffer();
      var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
      this._s = this.ghash(this._hashSubkey, this._s, lengths);
      var tag = [];
      this.cipher.encrypt(this._j0, tag);
      for (var i = 0; i < this._ints; ++i) {
        this.tag.putInt32(this._s[i] ^ tag[i]);
      }
      this.tag.truncate(this.tag.length() % (this._tagLength / 8));
      if (options.decrypt && this.tag.bytes() !== this._tag) {
        rval = false;
      }
      return rval;
    };
    modes.gcm.prototype.multiply = function(x, y2) {
      var z_i = [0, 0, 0, 0];
      var v_i = y2.slice(0);
      for (var i = 0; i < 128; ++i) {
        var x_i = x[i / 32 | 0] & 1 << 31 - i % 32;
        if (x_i) {
          z_i[0] ^= v_i[0];
          z_i[1] ^= v_i[1];
          z_i[2] ^= v_i[2];
          z_i[3] ^= v_i[3];
        }
        this.pow(v_i, v_i);
      }
      return z_i;
    };
    modes.gcm.prototype.pow = function(x, out) {
      var lsb = x[3] & 1;
      for (var i = 3; i > 0; --i) {
        out[i] = x[i] >>> 1 | (x[i - 1] & 1) << 31;
      }
      out[0] = x[0] >>> 1;
      if (lsb) {
        out[0] ^= this._R;
      }
    };
    modes.gcm.prototype.tableMultiply = function(x) {
      var z = [0, 0, 0, 0];
      for (var i = 0; i < 32; ++i) {
        var idx = i / 8 | 0;
        var x_i = x[idx] >>> (7 - i % 8) * 4 & 15;
        var ah = this._m[i][x_i];
        z[0] ^= ah[0];
        z[1] ^= ah[1];
        z[2] ^= ah[2];
        z[3] ^= ah[3];
      }
      return z;
    };
    modes.gcm.prototype.ghash = function(h2, y2, x) {
      y2[0] ^= x[0];
      y2[1] ^= x[1];
      y2[2] ^= x[2];
      y2[3] ^= x[3];
      return this.tableMultiply(y2);
    };
    modes.gcm.prototype.generateHashTable = function(h2, bits) {
      var multiplier = 8 / bits;
      var perInt = 4 * multiplier;
      var size = 16 * multiplier;
      var m = new Array(size);
      for (var i = 0; i < size; ++i) {
        var tmp = [0, 0, 0, 0];
        var idx = i / perInt | 0;
        var shft = (perInt - 1 - i % perInt) * bits;
        tmp[idx] = 1 << bits - 1 << shft;
        m[i] = this.generateSubHashTable(this.multiply(tmp, h2), bits);
      }
      return m;
    };
    modes.gcm.prototype.generateSubHashTable = function(mid, bits) {
      var size = 1 << bits;
      var half = size >>> 1;
      var m = new Array(size);
      m[half] = mid.slice(0);
      var i = half >>> 1;
      while (i > 0) {
        this.pow(m[2 * i], m[i] = []);
        i >>= 1;
      }
      i = 2;
      while (i < half) {
        for (var j = 1; j < i; ++j) {
          var m_i = m[i];
          var m_j = m[j];
          m[i + j] = [
            m_i[0] ^ m_j[0],
            m_i[1] ^ m_j[1],
            m_i[2] ^ m_j[2],
            m_i[3] ^ m_j[3]
          ];
        }
        i *= 2;
      }
      m[0] = [0, 0, 0, 0];
      for (i = half + 1; i < size; ++i) {
        var c = m[i ^ half];
        m[i] = [mid[0] ^ c[0], mid[1] ^ c[1], mid[2] ^ c[2], mid[3] ^ c[3]];
      }
      return m;
    };
    function transformIV(iv, blockSize) {
      if (typeof iv === "string") {
        iv = forge.util.createBuffer(iv);
      }
      if (forge.util.isArray(iv) && iv.length > 4) {
        var tmp = iv;
        iv = forge.util.createBuffer();
        for (var i = 0; i < tmp.length; ++i) {
          iv.putByte(tmp[i]);
        }
      }
      if (iv.length() < blockSize) {
        throw new Error(
          "Invalid IV length; got " + iv.length() + " bytes and expected " + blockSize + " bytes."
        );
      }
      if (!forge.util.isArray(iv)) {
        var ints = [];
        var blocks = blockSize / 4;
        for (var i = 0; i < blocks; ++i) {
          ints.push(iv.getInt32());
        }
        iv = ints;
      }
      return iv;
    }
    function inc32(block) {
      block[block.length - 1] = block[block.length - 1] + 1 & 4294967295;
    }
    function from64To32(num) {
      return [num / 4294967296 | 0, num & 4294967295];
    }
  }
});

// node_modules/node-forge/lib/aes.js
var require_aes = __commonJS({
  "node_modules/node-forge/lib/aes.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_cipher();
    require_cipherModes();
    require_util();
    module2.exports = forge.aes = forge.aes || {};
    forge.aes.startEncrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key,
        output,
        decrypt: false,
        mode
      });
      cipher.start(iv);
      return cipher;
    };
    forge.aes.createEncryptionCipher = function(key, mode) {
      return _createCipher({
        key,
        output: null,
        decrypt: false,
        mode
      });
    };
    forge.aes.startDecrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key,
        output,
        decrypt: true,
        mode
      });
      cipher.start(iv);
      return cipher;
    };
    forge.aes.createDecryptionCipher = function(key, mode) {
      return _createCipher({
        key,
        output: null,
        decrypt: true,
        mode
      });
    };
    forge.aes.Algorithm = function(name2, mode) {
      if (!init) {
        initialize();
      }
      var self2 = this;
      self2.name = name2;
      self2.mode = new mode({
        blockSize: 16,
        cipher: {
          encrypt: function(inBlock, outBlock) {
            return _updateBlock(self2._w, inBlock, outBlock, false);
          },
          decrypt: function(inBlock, outBlock) {
            return _updateBlock(self2._w, inBlock, outBlock, true);
          }
        }
      });
      self2._init = false;
    };
    forge.aes.Algorithm.prototype.initialize = function(options) {
      if (this._init) {
        return;
      }
      var key = options.key;
      var tmp;
      if (typeof key === "string" && (key.length === 16 || key.length === 24 || key.length === 32)) {
        key = forge.util.createBuffer(key);
      } else if (forge.util.isArray(key) && (key.length === 16 || key.length === 24 || key.length === 32)) {
        tmp = key;
        key = forge.util.createBuffer();
        for (var i = 0; i < tmp.length; ++i) {
          key.putByte(tmp[i]);
        }
      }
      if (!forge.util.isArray(key)) {
        tmp = key;
        key = [];
        var len = tmp.length();
        if (len === 16 || len === 24 || len === 32) {
          len = len >>> 2;
          for (var i = 0; i < len; ++i) {
            key.push(tmp.getInt32());
          }
        }
      }
      if (!forge.util.isArray(key) || !(key.length === 4 || key.length === 6 || key.length === 8)) {
        throw new Error("Invalid key parameter.");
      }
      var mode = this.mode.name;
      var encryptOp = ["CFB", "OFB", "CTR", "GCM"].indexOf(mode) !== -1;
      this._w = _expandKey(key, options.decrypt && !encryptOp);
      this._init = true;
    };
    forge.aes._expandKey = function(key, decrypt) {
      if (!init) {
        initialize();
      }
      return _expandKey(key, decrypt);
    };
    forge.aes._updateBlock = _updateBlock;
    registerAlgorithm("AES-ECB", forge.cipher.modes.ecb);
    registerAlgorithm("AES-CBC", forge.cipher.modes.cbc);
    registerAlgorithm("AES-CFB", forge.cipher.modes.cfb);
    registerAlgorithm("AES-OFB", forge.cipher.modes.ofb);
    registerAlgorithm("AES-CTR", forge.cipher.modes.ctr);
    registerAlgorithm("AES-GCM", forge.cipher.modes.gcm);
    function registerAlgorithm(name2, mode) {
      var factory = function() {
        return new forge.aes.Algorithm(name2, mode);
      };
      forge.cipher.registerAlgorithm(name2, factory);
    }
    var init = false;
    var Nb = 4;
    var sbox;
    var isbox;
    var rcon;
    var mix;
    var imix;
    function initialize() {
      init = true;
      rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
      var xtime = new Array(256);
      for (var i = 0; i < 128; ++i) {
        xtime[i] = i << 1;
        xtime[i + 128] = i + 128 << 1 ^ 283;
      }
      sbox = new Array(256);
      isbox = new Array(256);
      mix = new Array(4);
      imix = new Array(4);
      for (var i = 0; i < 4; ++i) {
        mix[i] = new Array(256);
        imix[i] = new Array(256);
      }
      var e2 = 0, ei = 0, e22, e4, e8, sx, sx2, me, ime;
      for (var i = 0; i < 256; ++i) {
        sx = ei ^ ei << 1 ^ ei << 2 ^ ei << 3 ^ ei << 4;
        sx = sx >> 8 ^ sx & 255 ^ 99;
        sbox[e2] = sx;
        isbox[sx] = e2;
        sx2 = xtime[sx];
        e22 = xtime[e2];
        e4 = xtime[e22];
        e8 = xtime[e4];
        me = sx2 << 24 ^ // 2
        sx << 16 ^ // 1
        sx << 8 ^ // 1
        (sx ^ sx2);
        ime = (e22 ^ e4 ^ e8) << 24 ^ // E (14)
        (e2 ^ e8) << 16 ^ // 9
        (e2 ^ e4 ^ e8) << 8 ^ // D (13)
        (e2 ^ e22 ^ e8);
        for (var n2 = 0; n2 < 4; ++n2) {
          mix[n2][e2] = me;
          imix[n2][sx] = ime;
          me = me << 24 | me >>> 8;
          ime = ime << 24 | ime >>> 8;
        }
        if (e2 === 0) {
          e2 = ei = 1;
        } else {
          e2 = e22 ^ xtime[xtime[xtime[e22 ^ e8]]];
          ei ^= xtime[xtime[ei]];
        }
      }
    }
    function _expandKey(key, decrypt) {
      var w2 = key.slice(0);
      var temp, iNk = 1;
      var Nk = w2.length;
      var Nr1 = Nk + 6 + 1;
      var end = Nb * Nr1;
      for (var i = Nk; i < end; ++i) {
        temp = w2[i - 1];
        if (i % Nk === 0) {
          temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ rcon[iNk] << 24;
          iNk++;
        } else if (Nk > 6 && i % Nk === 4) {
          temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
        }
        w2[i] = w2[i - Nk] ^ temp;
      }
      if (decrypt) {
        var tmp;
        var m0 = imix[0];
        var m1 = imix[1];
        var m2 = imix[2];
        var m3 = imix[3];
        var wnew = w2.slice(0);
        end = w2.length;
        for (var i = 0, wi = end - Nb; i < end; i += Nb, wi -= Nb) {
          if (i === 0 || i === end - Nb) {
            wnew[i] = w2[wi];
            wnew[i + 1] = w2[wi + 3];
            wnew[i + 2] = w2[wi + 2];
            wnew[i + 3] = w2[wi + 1];
          } else {
            for (var n2 = 0; n2 < Nb; ++n2) {
              tmp = w2[wi + n2];
              wnew[i + (3 & -n2)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m2[sbox[tmp >>> 8 & 255]] ^ m3[sbox[tmp & 255]];
            }
          }
        }
        w2 = wnew;
      }
      return w2;
    }
    function _updateBlock(w2, input, output, decrypt) {
      var Nr = w2.length / 4 - 1;
      var m0, m1, m2, m3, sub;
      if (decrypt) {
        m0 = imix[0];
        m1 = imix[1];
        m2 = imix[2];
        m3 = imix[3];
        sub = isbox;
      } else {
        m0 = mix[0];
        m1 = mix[1];
        m2 = mix[2];
        m3 = mix[3];
        sub = sbox;
      }
      var a, b2, c, d2, a2, b22, c2;
      a = input[0] ^ w2[0];
      b2 = input[decrypt ? 3 : 1] ^ w2[1];
      c = input[2] ^ w2[2];
      d2 = input[decrypt ? 1 : 3] ^ w2[3];
      var i = 3;
      for (var round = 1; round < Nr; ++round) {
        a2 = m0[a >>> 24] ^ m1[b2 >>> 16 & 255] ^ m2[c >>> 8 & 255] ^ m3[d2 & 255] ^ w2[++i];
        b22 = m0[b2 >>> 24] ^ m1[c >>> 16 & 255] ^ m2[d2 >>> 8 & 255] ^ m3[a & 255] ^ w2[++i];
        c2 = m0[c >>> 24] ^ m1[d2 >>> 16 & 255] ^ m2[a >>> 8 & 255] ^ m3[b2 & 255] ^ w2[++i];
        d2 = m0[d2 >>> 24] ^ m1[a >>> 16 & 255] ^ m2[b2 >>> 8 & 255] ^ m3[c & 255] ^ w2[++i];
        a = a2;
        b2 = b22;
        c = c2;
      }
      output[0] = sub[a >>> 24] << 24 ^ sub[b2 >>> 16 & 255] << 16 ^ sub[c >>> 8 & 255] << 8 ^ sub[d2 & 255] ^ w2[++i];
      output[decrypt ? 3 : 1] = sub[b2 >>> 24] << 24 ^ sub[c >>> 16 & 255] << 16 ^ sub[d2 >>> 8 & 255] << 8 ^ sub[a & 255] ^ w2[++i];
      output[2] = sub[c >>> 24] << 24 ^ sub[d2 >>> 16 & 255] << 16 ^ sub[a >>> 8 & 255] << 8 ^ sub[b2 & 255] ^ w2[++i];
      output[decrypt ? 1 : 3] = sub[d2 >>> 24] << 24 ^ sub[a >>> 16 & 255] << 16 ^ sub[b2 >>> 8 & 255] << 8 ^ sub[c & 255] ^ w2[++i];
    }
    function _createCipher(options) {
      options = options || {};
      var mode = (options.mode || "CBC").toUpperCase();
      var algorithm = "AES-" + mode;
      var cipher;
      if (options.decrypt) {
        cipher = forge.cipher.createDecipher(algorithm, options.key);
      } else {
        cipher = forge.cipher.createCipher(algorithm, options.key);
      }
      var start = cipher.start;
      cipher.start = function(iv, options2) {
        var output = null;
        if (options2 instanceof forge.util.ByteBuffer) {
          output = options2;
          options2 = {};
        }
        options2 = options2 || {};
        options2.output = output;
        options2.iv = iv;
        start.call(cipher, options2);
      };
      return cipher;
    }
  }
});

// node_modules/libp2p-crypto/src/aes/ciphers-browser.js
var require_ciphers_browser = __commonJS({
  "node_modules/libp2p-crypto/src/aes/ciphers-browser.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    require_aes();
    var forge = require_forge();
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
    module2.exports = {
      createCipheriv: (mode, key, iv) => {
        const cipher2 = forge.cipher.createCipher("AES-CTR", uint8ArrayToString(key, "ascii"));
        cipher2.start({ iv: uint8ArrayToString(iv, "ascii") });
        return {
          update: (data) => {
            cipher2.update(forge.util.createBuffer(uint8ArrayToString(data, "ascii")));
            return uint8ArrayFromString(cipher2.output.getBytes(), "ascii");
          }
        };
      },
      createDecipheriv: (mode, key, iv) => {
        const cipher2 = forge.cipher.createDecipher("AES-CTR", uint8ArrayToString(key, "ascii"));
        cipher2.start({ iv: uint8ArrayToString(iv, "ascii") });
        return {
          update: (data) => {
            cipher2.update(forge.util.createBuffer(uint8ArrayToString(data, "ascii")));
            return uint8ArrayFromString(cipher2.output.getBytes(), "ascii");
          }
        };
      }
    };
  }
});

// node_modules/err-code/index.js
var require_err_code = __commonJS({
  "node_modules/err-code/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    function assign(obj, props) {
      for (const key in props) {
        Object.defineProperty(obj, key, {
          value: props[key],
          enumerable: true,
          configurable: true
        });
      }
      return obj;
    }
    function createError(err, code2, props) {
      if (!err || typeof err === "string") {
        throw new TypeError("Please pass an Error to err-code");
      }
      if (!props) {
        props = {};
      }
      if (typeof code2 === "object") {
        props = code2;
        code2 = "";
      }
      if (code2) {
        props.code = code2;
      }
      try {
        return assign(err, props);
      } catch (_2) {
        props.message = err.message;
        props.stack = err.stack;
        const ErrClass = function() {
        };
        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));
        const output = assign(new ErrClass(), props);
        return output;
      }
    }
    module2.exports = createError;
  }
});

// node_modules/libp2p-crypto/src/aes/cipher-mode.js
var require_cipher_mode = __commonJS({
  "node_modules/libp2p-crypto/src/aes/cipher-mode.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var errcode = require_err_code();
    var CIPHER_MODES = {
      16: "aes-128-ctr",
      32: "aes-256-ctr"
    };
    module2.exports = function(key) {
      const mode = CIPHER_MODES[key.length];
      if (!mode) {
        const modes = Object.entries(CIPHER_MODES).map(([k, v2]) => `${k} (${v2})`).join(" / ");
        throw errcode(new Error(`Invalid key length ${key.length} bytes. Must be ${modes}`), "ERR_INVALID_KEY_LENGTH");
      }
      return mode;
    };
  }
});

// node_modules/libp2p-crypto/src/aes/index.js
var require_aes2 = __commonJS({
  "node_modules/libp2p-crypto/src/aes/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var ciphers = require_ciphers_browser();
    var cipherMode = require_cipher_mode();
    exports2.create = async function(key, iv) {
      const mode = cipherMode(key);
      const cipher = ciphers.createCipheriv(mode, key, iv);
      const decipher = ciphers.createDecipheriv(mode, key, iv);
      const res = {
        async encrypt(data) {
          return cipher.update(data);
        },
        async decrypt(data) {
          return decipher.update(data);
        }
      };
      return res;
    };
  }
});

// node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS({
  "node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false;
            if (err)
              reject(err);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve.apply(null, params2);
            }
          }
        };
        try {
          fn.apply(ctx || null, params);
        } catch (err) {
          if (pending) {
            pending = false;
            reject(err);
          }
        }
      });
    }
  }
});

// node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS({
  "node_modules/@protobufjs/base64/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var base642 = exports2;
    base642.length = function length2(string2) {
      var p2 = string2.length;
      if (!p2)
        return 0;
      var n2 = 0;
      while (--p2 % 4 > 1 && string2.charAt(p2) === "=")
        ++n2;
      return Math.ceil(string2.length * 3) / 4 - n2;
    };
    var b64 = new Array(64);
    var s64 = new Array(123);
    for (i = 0; i < 64; )
      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
    var i;
    base642.encode = function encode6(buffer2, start, end) {
      var parts = null, chunk = [];
      var i2 = 0, j = 0, t2;
      while (start < end) {
        var b2 = buffer2[start++];
        switch (j) {
          case 0:
            chunk[i2++] = b64[b2 >> 2];
            t2 = (b2 & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i2++] = b64[t2 | b2 >> 4];
            t2 = (b2 & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i2++] = b64[t2 | b2 >> 6];
            chunk[i2++] = b64[b2 & 63];
            j = 0;
            break;
        }
        if (i2 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i2 = 0;
        }
      }
      if (j) {
        chunk[i2++] = b64[t2];
        chunk[i2++] = 61;
        if (j === 1)
          chunk[i2++] = 61;
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2));
    };
    var invalidEncoding = "invalid encoding";
    base642.decode = function decode7(string2, buffer2, offset) {
      var start = offset;
      var j = 0, t2;
      for (var i2 = 0; i2 < string2.length; ) {
        var c = string2.charCodeAt(i2++);
        if (c === 61 && j > 1)
          break;
        if ((c = s64[c]) === void 0)
          throw Error(invalidEncoding);
        switch (j) {
          case 0:
            t2 = c;
            j = 1;
            break;
          case 1:
            buffer2[offset++] = t2 << 2 | (c & 48) >> 4;
            t2 = c;
            j = 2;
            break;
          case 2:
            buffer2[offset++] = (t2 & 15) << 4 | (c & 60) >> 2;
            t2 = c;
            j = 3;
            break;
          case 3:
            buffer2[offset++] = (t2 & 3) << 6 | c;
            j = 0;
            break;
        }
      }
      if (j === 1)
        throw Error(invalidEncoding);
      return offset - start;
    };
    base642.test = function test(string2) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string2);
    };
  }
});

// node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS({
  "node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = EventEmitter;
    function EventEmitter() {
      this._listeners = {};
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    };
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0)
        this._listeners = {};
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    };
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    };
  }
});

// node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  "node_modules/@protobufjs/float/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = factory(factory);
    function factory(exports3) {
      if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf2, pos) {
          f32[0] = val;
          buf2[pos] = f8b[0];
          buf2[pos + 1] = f8b[1];
          buf2[pos + 2] = f8b[2];
          buf2[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf2, pos) {
          f32[0] = val;
          buf2[pos] = f8b[3];
          buf2[pos + 1] = f8b[2];
          buf2[pos + 2] = f8b[1];
          buf2[pos + 3] = f8b[0];
        }
        exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf2, pos) {
          f8b[0] = buf2[pos];
          f8b[1] = buf2[pos + 1];
          f8b[2] = buf2[pos + 2];
          f8b[3] = buf2[pos + 3];
          return f32[0];
        }
        function readFloat_f32_rev(buf2, pos) {
          f8b[3] = buf2[pos];
          f8b[2] = buf2[pos + 1];
          f8b[1] = buf2[pos + 2];
          f8b[0] = buf2[pos + 3];
          return f32[0];
        }
        exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
      })();
      else (function() {
        function writeFloat_ieee754(writeUint, val, buf2, pos) {
          var sign2 = val < 0 ? 1 : 0;
          if (sign2)
            val = -val;
          if (val === 0)
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf2, pos);
          else if (isNaN(val))
            writeUint(2143289344, buf2, pos);
          else if (val > 34028234663852886e22)
            writeUint((sign2 << 31 | 2139095040) >>> 0, buf2, pos);
          else if (val < 11754943508222875e-54)
            writeUint((sign2 << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf2, pos);
          else {
            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
            writeUint((sign2 << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf2, pos);
          }
        }
        exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf2, pos) {
          var uint = readUint(buf2, pos), sign2 = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign2 * Infinity : exponent === 0 ? sign2 * 1401298464324817e-60 * mantissa : sign2 * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
      })();
      if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf2, pos) {
          f64[0] = val;
          buf2[pos] = f8b[0];
          buf2[pos + 1] = f8b[1];
          buf2[pos + 2] = f8b[2];
          buf2[pos + 3] = f8b[3];
          buf2[pos + 4] = f8b[4];
          buf2[pos + 5] = f8b[5];
          buf2[pos + 6] = f8b[6];
          buf2[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf2, pos) {
          f64[0] = val;
          buf2[pos] = f8b[7];
          buf2[pos + 1] = f8b[6];
          buf2[pos + 2] = f8b[5];
          buf2[pos + 3] = f8b[4];
          buf2[pos + 4] = f8b[3];
          buf2[pos + 5] = f8b[2];
          buf2[pos + 6] = f8b[1];
          buf2[pos + 7] = f8b[0];
        }
        exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf2, pos) {
          f8b[0] = buf2[pos];
          f8b[1] = buf2[pos + 1];
          f8b[2] = buf2[pos + 2];
          f8b[3] = buf2[pos + 3];
          f8b[4] = buf2[pos + 4];
          f8b[5] = buf2[pos + 5];
          f8b[6] = buf2[pos + 6];
          f8b[7] = buf2[pos + 7];
          return f64[0];
        }
        function readDouble_f64_rev(buf2, pos) {
          f8b[7] = buf2[pos];
          f8b[6] = buf2[pos + 1];
          f8b[5] = buf2[pos + 2];
          f8b[4] = buf2[pos + 3];
          f8b[3] = buf2[pos + 4];
          f8b[2] = buf2[pos + 5];
          f8b[1] = buf2[pos + 6];
          f8b[0] = buf2[pos + 7];
          return f64[0];
        }
        exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
      })();
      else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf2, pos) {
          var sign2 = val < 0 ? 1 : 0;
          if (sign2)
            val = -val;
          if (val === 0) {
            writeUint(0, buf2, pos + off0);
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf2, pos + off1);
          } else if (isNaN(val)) {
            writeUint(0, buf2, pos + off0);
            writeUint(2146959360, buf2, pos + off1);
          } else if (val > 17976931348623157e292) {
            writeUint(0, buf2, pos + off0);
            writeUint((sign2 << 31 | 2146435072) >>> 0, buf2, pos + off1);
          } else {
            var mantissa;
            if (val < 22250738585072014e-324) {
              mantissa = val / 5e-324;
              writeUint(mantissa >>> 0, buf2, pos + off0);
              writeUint((sign2 << 31 | mantissa / 4294967296) >>> 0, buf2, pos + off1);
            } else {
              var exponent = Math.floor(Math.log(val) / Math.LN2);
              if (exponent === 1024)
                exponent = 1023;
              mantissa = val * Math.pow(2, -exponent);
              writeUint(mantissa * 4503599627370496 >>> 0, buf2, pos + off0);
              writeUint((sign2 << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf2, pos + off1);
            }
          }
        }
        exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf2, pos) {
          var lo = readUint(buf2, pos + off0), hi = readUint(buf2, pos + off1);
          var sign2 = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign2 * Infinity : exponent === 0 ? sign2 * 5e-324 * mantissa : sign2 * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
      return exports3;
    }
    function writeUintLE(val, buf2, pos) {
      buf2[pos] = val & 255;
      buf2[pos + 1] = val >>> 8 & 255;
      buf2[pos + 2] = val >>> 16 & 255;
      buf2[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf2, pos) {
      buf2[pos] = val >>> 24;
      buf2[pos + 1] = val >>> 16 & 255;
      buf2[pos + 2] = val >>> 8 & 255;
      buf2[pos + 3] = val & 255;
    }
    function readUintLE(buf2, pos) {
      return (buf2[pos] | buf2[pos + 1] << 8 | buf2[pos + 2] << 16 | buf2[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf2, pos) {
      return (buf2[pos] << 24 | buf2[pos + 1] << 16 | buf2[pos + 2] << 8 | buf2[pos + 3]) >>> 0;
    }
  }
});

// node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS({
  "node_modules/@protobufjs/inquire/index.js"(exports, module) {
    "use strict";
    init_esbuild_shims();
    module.exports = inquire;
    function inquire(moduleName) {
      try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName);
        if (mod && (mod.length || Object.keys(mod).length))
          return mod;
      } catch (e2) {
      }
      return null;
    }
  }
});

// node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  "node_modules/@protobufjs/utf8/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var utf8 = exports2;
    utf8.length = function utf8_length(string2) {
      var len = 0, c = 0;
      for (var i = 0; i < string2.length; ++i) {
        c = string2.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string2.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    };
    utf8.read = function utf8_read(buffer2, start, end) {
      var len = end - start;
      if (len < 1)
        return "";
      var parts = null, chunk = [], i = 0, t2;
      while (start < end) {
        t2 = buffer2[start++];
        if (t2 < 128)
          chunk[i++] = t2;
        else if (t2 > 191 && t2 < 224)
          chunk[i++] = (t2 & 31) << 6 | buffer2[start++] & 63;
        else if (t2 > 239 && t2 < 365) {
          t2 = ((t2 & 7) << 18 | (buffer2[start++] & 63) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63) - 65536;
          chunk[i++] = 55296 + (t2 >> 10);
          chunk[i++] = 56320 + (t2 & 1023);
        } else
          chunk[i++] = (t2 & 15) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63;
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i));
    };
    utf8.write = function utf8_write(string2, buffer2, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string2.length; ++i) {
        c1 = string2.charCodeAt(i);
        if (c1 < 128) {
          buffer2[offset++] = c1;
        } else if (c1 < 2048) {
          buffer2[offset++] = c1 >> 6 | 192;
          buffer2[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string2.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer2[offset++] = c1 >> 18 | 240;
          buffer2[offset++] = c1 >> 12 & 63 | 128;
          buffer2[offset++] = c1 >> 6 & 63 | 128;
          buffer2[offset++] = c1 & 63 | 128;
        } else {
          buffer2[offset++] = c1 >> 12 | 224;
          buffer2[offset++] = c1 >> 6 & 63 | 128;
          buffer2[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    };
  }
});

// node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS({
  "node_modules/@protobufjs/pool/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = pool;
    function pool(alloc2, slice2, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc2(size2);
        if (offset + size2 > SIZE) {
          slab = alloc2(SIZE);
          offset = 0;
        }
        var buf2 = slice2.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf2;
      };
    }
  }
});

// node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = LongBits;
    var util = require_minimal();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = function fromNumber(value) {
      if (value === 0)
        return zero;
      var sign2 = value < 0;
      if (sign2)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign2) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    };
    LongBits.from = function from3(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };
    LongBits.prototype.toNumber = function toNumber(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    };
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    };
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    };
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.length = function length2() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    };
  }
});

// node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "node_modules/protobufjs/src/util/minimal.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var util = exports2;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.inquire = require_inquire();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
    util.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util.isInteger = Number.isInteger || /* istanbul ignore next */
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util.isString = function isString(value) {
      return typeof value === "string" || value instanceof String;
    };
    util.isObject = function isObject(value) {
      return value && typeof value === "object";
    };
    util.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isSet = function isSet(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util.Buffer = function() {
      try {
        var Buffer3 = util.inquire("buffer").Buffer;
        return Buffer3.prototype.utf8Write ? Buffer3 : (
          /* istanbul ignore next */
          null
        );
      } catch (e2) {
        return null;
      }
    }();
    util._Buffer_from = null;
    util._Buffer_allocUnsafe = null;
    util.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util.Long = /* istanbul ignore next */
    util.global.dcodeIO && /* istanbul ignore next */
    util.global.dcodeIO.Long || /* istanbul ignore next */
    util.global.Long || util.inquire("long");
    util.key2Re = /^true|false|0|1$/;
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util.longToHash = function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
    };
    util.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util.LongBits.fromHash(hash);
      if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge(dst, src2, ifNotSet) {
      for (var keys = Object.keys(src2), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === void 0 || !ifNotSet)
          dst[keys[i]] = src2[keys[i]];
      return dst;
    }
    util.merge = merge;
    util.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name2) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;
      Object.defineProperty(CustomError.prototype, "name", { get: function() {
        return name2;
      } });
      CustomError.prototype.toString = function toString4() {
        return this.name + ": " + this.message;
      };
      return CustomError;
    }
    util.newError = newError;
    util.ProtocolError = newError("ProtocolError");
    util.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    };
    util.oneOfSetter = function setOneOf(fieldNames) {
      return function(name2) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name2)
            delete this[fieldNames[i]];
      };
    };
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util._configure = function() {
      var Buffer3 = util.Buffer;
      if (!Buffer3) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
      }
      util._Buffer_from = Buffer3.from !== Uint8Array.from && Buffer3.from || /* istanbul ignore next */
      function Buffer_from(value, encoding) {
        return new Buffer3(value, encoding);
      };
      util._Buffer_allocUnsafe = Buffer3.allocUnsafe || /* istanbul ignore next */
      function Buffer_allocUnsafe(size) {
        return new Buffer3(size);
      };
    };
  }
});

// node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "node_modules/protobufjs/src/writer.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = Writer;
    var util = require_minimal();
    var BufferWriter;
    var LongBits = util.LongBits;
    var base642 = util.base64;
    var utf8 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    function noop() {
    }
    function State(writer) {
      this.head = writer.head;
      this.tail = writer.tail;
      this.len = writer.len;
      this.next = writer.states;
    }
    function Writer() {
      this.len = 0;
      this.head = new Op(noop, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    var create3 = function create4() {
      return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      } : function create_array() {
        return new Writer();
      };
    };
    Writer.create = create3();
    Writer.alloc = function alloc2(size) {
      return new util.Array(size);
    };
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    };
    function writeByte(val, buf2, pos) {
      buf2[pos] = val & 255;
    }
    function writeVarint32(val, buf2, pos) {
      while (val > 127) {
        buf2[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf2[pos] = val;
    }
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    };
    Writer.prototype.int32 = function write_int32(value) {
      return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    };
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };
    function writeVarint64(val, buf2, pos) {
      while (val.hi) {
        buf2[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
      }
      while (val.lo > 127) {
        buf2[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
      }
      buf2[pos++] = val.lo;
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value);
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    };
    function writeFixed32(val, buf2, pos) {
      buf2[pos] = val & 255;
      buf2[pos + 1] = val >>> 8 & 255;
      buf2[pos + 2] = val >>> 16 & 255;
      buf2[pos + 3] = val >>> 24;
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    };
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value);
      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    };
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    };
    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf2, pos) {
      buf2.set(val, pos);
    } : function writeBytes_for(val, buf2, pos) {
      for (var i = 0; i < val.length; ++i)
        buf2[pos + i] = val[i];
    };
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf2 = Writer.alloc(len = base642.length(value));
        base642.decode(value, buf2, 0);
        value = buf2;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    };
    Writer.prototype.string = function write_string(value) {
      var len = utf8.length(value);
      return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
    };
    Writer.prototype.fork = function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
      return this;
    };
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
      }
      return this;
    };
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    };
    Writer.prototype.finish = function finish() {
      var head = this.head.next, buf2 = this.constructor.alloc(this.len), pos = 0;
      while (head) {
        head.fn(head.val, buf2, pos);
        pos += head.len;
        head = head.next;
      }
      return buf2;
    };
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create3();
      BufferWriter._configure();
    };
  }
});

// node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = BufferWriter;
    var Writer = require_writer();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = require_minimal();
    function BufferWriter() {
      Writer.call(this);
    }
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf2, pos) {
        buf2.set(val, pos);
      } : function writeBytesBuffer_copy(val, buf2, pos) {
        if (val.copy)
          val.copy(buf2, pos, 0, val.length);
        else for (var i = 0; i < val.length; )
          buf2[pos++] = val[i++];
      };
    };
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    };
    function writeStringBuffer(val, buf2, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf2, pos);
      else if (buf2.utf8Write)
        buf2.utf8Write(val, pos);
      else
        buf2.write(val, pos);
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(writeStringBuffer, len, value);
      return this;
    };
    BufferWriter._configure();
  }
});

// node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "node_modules/protobufjs/src/reader.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = Reader;
    var util = require_minimal();
    var BufferReader;
    var LongBits = util.LongBits;
    var utf8 = util.utf8;
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
    function Reader(buffer2) {
      this.buf = buffer2;
      this.pos = 0;
      this.len = buffer2.length;
    }
    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer2) {
      if (buffer2 instanceof Uint8Array || Array.isArray(buffer2))
        return new Reader(buffer2);
      throw Error("illegal buffer");
    } : function create_array2(buffer2) {
      if (Array.isArray(buffer2))
        return new Reader(buffer2);
      throw Error("illegal buffer");
    };
    var create3 = function create4() {
      return util.Buffer ? function create_buffer_setup(buffer2) {
        return (Reader.create = function create_buffer(buffer3) {
          return util.Buffer.isBuffer(buffer3) ? new BufferReader(buffer3) : create_array(buffer3);
        })(buffer2);
      } : create_array;
    };
    Reader.create = create3();
    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
    util.Array.prototype.slice;
    Reader.prototype.uint32 = /* @__PURE__ */ function read_uint32_setup() {
      var value = 4294967295;
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        if ((this.pos += 5) > this.len) {
          this.pos = this.len;
          throw indexOutOfRange(this, 10);
        }
        return value;
      };
    }();
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0;
    };
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    };
    function readLongVarint() {
      var bits = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      }
      throw Error("invalid varint encoding");
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0;
    };
    function readFixed32_end(buf2, end) {
      return (buf2[end - 4] | buf2[end - 3] << 8 | buf2[end - 2] << 16 | buf2[end - 1] << 24) >>> 0;
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    };
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    };
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    };
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    };
    Reader.prototype.bytes = function read_bytes() {
      var length2 = this.uint32(), start = this.pos, end = this.pos + length2;
      if (end > this.len)
        throw indexOutOfRange(this, length2);
      this.pos += length2;
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
    };
    Reader.prototype.string = function read_string() {
      var bytes = this.bytes();
      return utf8.read(bytes, 0, bytes.length);
    };
    Reader.prototype.skip = function skip(length2) {
      if (typeof length2 === "number") {
        if (this.pos + length2 > this.len)
          throw indexOutOfRange(this, length2);
        this.pos += length2;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    };
    Reader.prototype.skipType = function(wireType) {
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType);
          }
          break;
        case 5:
          this.skip(4);
          break;
        /* istanbul ignore next */
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create3();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : (
        /* istanbul ignore next */
        "toNumber"
      );
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }
      });
    };
  }
});

// node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = BufferReader;
    var Reader = require_reader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = require_minimal();
    function BufferReader(buffer2) {
      Reader.call(this, buffer2);
    }
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32();
      return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
    };
    BufferReader._configure();
  }
});

// node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = Service;
    var util = require_minimal();
    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(
                /* endedByRPC */
                true
              );
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }
        );
      } catch (err) {
        self2.emit("error", err, method);
        setTimeout(function() {
          callback(err);
        }, 0);
        return void 0;
      }
    };
    Service.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    };
  }
});

// node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "node_modules/protobufjs/src/rpc.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var rpc = exports2;
    rpc.Service = require_service();
  }
});

// node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "node_modules/protobufjs/src/roots.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = {};
  }
});

// node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "node_modules/protobufjs/src/index-minimal.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var protobuf = exports2;
    protobuf.build = "minimal";
    protobuf.Writer = require_writer();
    protobuf.BufferWriter = require_writer_buffer();
    protobuf.Reader = require_reader();
    protobuf.BufferReader = require_reader_buffer();
    protobuf.util = require_minimal();
    protobuf.rpc = require_rpc();
    protobuf.roots = require_roots();
    protobuf.configure = configure;
    function configure() {
      protobuf.util._configure();
      protobuf.Writer._configure(protobuf.BufferWriter);
      protobuf.Reader._configure(protobuf.BufferReader);
    }
    configure();
  }
});

// node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  "node_modules/protobufjs/minimal.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    module2.exports = require_index_minimal();
  }
});

// node_modules/libp2p-crypto/src/keys/keys.js
var require_keys = __commonJS({
  "node_modules/libp2p-crypto/src/keys/keys.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var $protobuf2 = require_minimal2();
    var $Reader2 = $protobuf2.Reader;
    var $Writer2 = $protobuf2.Writer;
    var $util2 = $protobuf2.util;
    var $root2 = $protobuf2.roots["libp2p-crypto-keys"] || ($protobuf2.roots["libp2p-crypto-keys"] = {});
    $root2.KeyType = function() {
      var valuesById = {}, values = Object.create(valuesById);
      values[valuesById[0] = "RSA"] = 0;
      values[valuesById[1] = "Ed25519"] = 1;
      values[valuesById[2] = "Secp256k1"] = 2;
      return values;
    }();
    $root2.PublicKey = function() {
      function PublicKey(p2) {
        if (p2) {
          for (var ks = Object.keys(p2), i = 0; i < ks.length; ++i)
            if (p2[ks[i]] != null)
              this[ks[i]] = p2[ks[i]];
        }
      }
      PublicKey.prototype.Type = 0;
      PublicKey.prototype.Data = $util2.newBuffer([]);
      PublicKey.encode = function encode6(m, w2) {
        if (!w2)
          w2 = $Writer2.create();
        w2.uint32(8).int32(m.Type);
        w2.uint32(18).bytes(m.Data);
        return w2;
      };
      PublicKey.decode = function decode7(r, l2) {
        if (!(r instanceof $Reader2))
          r = $Reader2.create(r);
        var c = l2 === void 0 ? r.len : r.pos + l2, m = new $root2.PublicKey();
        while (r.pos < c) {
          var t2 = r.uint32();
          switch (t2 >>> 3) {
            case 1:
              m.Type = r.int32();
              break;
            case 2:
              m.Data = r.bytes();
              break;
            default:
              r.skipType(t2 & 7);
              break;
          }
        }
        if (!m.hasOwnProperty("Type"))
          throw $util2.ProtocolError("missing required 'Type'", { instance: m });
        if (!m.hasOwnProperty("Data"))
          throw $util2.ProtocolError("missing required 'Data'", { instance: m });
        return m;
      };
      PublicKey.fromObject = function fromObject(d2) {
        if (d2 instanceof $root2.PublicKey)
          return d2;
        var m = new $root2.PublicKey();
        switch (d2.Type) {
          case "RSA":
          case 0:
            m.Type = 0;
            break;
          case "Ed25519":
          case 1:
            m.Type = 1;
            break;
          case "Secp256k1":
          case 2:
            m.Type = 2;
            break;
        }
        if (d2.Data != null) {
          if (typeof d2.Data === "string")
            $util2.base64.decode(d2.Data, m.Data = $util2.newBuffer($util2.base64.length(d2.Data)), 0);
          else if (d2.Data.length)
            m.Data = d2.Data;
        }
        return m;
      };
      PublicKey.toObject = function toObject(m, o) {
        if (!o)
          o = {};
        var d2 = {};
        if (o.defaults) {
          d2.Type = o.enums === String ? "RSA" : 0;
          if (o.bytes === String)
            d2.Data = "";
          else {
            d2.Data = [];
            if (o.bytes !== Array)
              d2.Data = $util2.newBuffer(d2.Data);
          }
        }
        if (m.Type != null && m.hasOwnProperty("Type")) {
          d2.Type = o.enums === String ? $root2.KeyType[m.Type] : m.Type;
        }
        if (m.Data != null && m.hasOwnProperty("Data")) {
          d2.Data = o.bytes === String ? $util2.base64.encode(m.Data, 0, m.Data.length) : o.bytes === Array ? Array.prototype.slice.call(m.Data) : m.Data;
        }
        return d2;
      };
      PublicKey.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf2.util.toJSONOptions);
      };
      return PublicKey;
    }();
    $root2.PrivateKey = function() {
      function PrivateKey(p2) {
        if (p2) {
          for (var ks = Object.keys(p2), i = 0; i < ks.length; ++i)
            if (p2[ks[i]] != null)
              this[ks[i]] = p2[ks[i]];
        }
      }
      PrivateKey.prototype.Type = 0;
      PrivateKey.prototype.Data = $util2.newBuffer([]);
      PrivateKey.encode = function encode6(m, w2) {
        if (!w2)
          w2 = $Writer2.create();
        w2.uint32(8).int32(m.Type);
        w2.uint32(18).bytes(m.Data);
        return w2;
      };
      PrivateKey.decode = function decode7(r, l2) {
        if (!(r instanceof $Reader2))
          r = $Reader2.create(r);
        var c = l2 === void 0 ? r.len : r.pos + l2, m = new $root2.PrivateKey();
        while (r.pos < c) {
          var t2 = r.uint32();
          switch (t2 >>> 3) {
            case 1:
              m.Type = r.int32();
              break;
            case 2:
              m.Data = r.bytes();
              break;
            default:
              r.skipType(t2 & 7);
              break;
          }
        }
        if (!m.hasOwnProperty("Type"))
          throw $util2.ProtocolError("missing required 'Type'", { instance: m });
        if (!m.hasOwnProperty("Data"))
          throw $util2.ProtocolError("missing required 'Data'", { instance: m });
        return m;
      };
      PrivateKey.fromObject = function fromObject(d2) {
        if (d2 instanceof $root2.PrivateKey)
          return d2;
        var m = new $root2.PrivateKey();
        switch (d2.Type) {
          case "RSA":
          case 0:
            m.Type = 0;
            break;
          case "Ed25519":
          case 1:
            m.Type = 1;
            break;
          case "Secp256k1":
          case 2:
            m.Type = 2;
            break;
        }
        if (d2.Data != null) {
          if (typeof d2.Data === "string")
            $util2.base64.decode(d2.Data, m.Data = $util2.newBuffer($util2.base64.length(d2.Data)), 0);
          else if (d2.Data.length)
            m.Data = d2.Data;
        }
        return m;
      };
      PrivateKey.toObject = function toObject(m, o) {
        if (!o)
          o = {};
        var d2 = {};
        if (o.defaults) {
          d2.Type = o.enums === String ? "RSA" : 0;
          if (o.bytes === String)
            d2.Data = "";
          else {
            d2.Data = [];
            if (o.bytes !== Array)
              d2.Data = $util2.newBuffer(d2.Data);
          }
        }
        if (m.Type != null && m.hasOwnProperty("Type")) {
          d2.Type = o.enums === String ? $root2.KeyType[m.Type] : m.Type;
        }
        if (m.Data != null && m.hasOwnProperty("Data")) {
          d2.Data = o.bytes === String ? $util2.base64.encode(m.Data, 0, m.Data.length) : o.bytes === Array ? Array.prototype.slice.call(m.Data) : m.Data;
        }
        return d2;
      };
      PrivateKey.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf2.util.toJSONOptions);
      };
      return PrivateKey;
    }();
    module2.exports = $root2;
  }
});

// node_modules/node-forge/lib/oids.js
var require_oids = __commonJS({
  "node_modules/node-forge/lib/oids.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    forge.pki = forge.pki || {};
    var oids = module2.exports = forge.pki.oids = forge.oids = forge.oids || {};
    function _IN(id, name2) {
      oids[id] = name2;
      oids[name2] = id;
    }
    function _I_(id, name2) {
      oids[id] = name2;
    }
    _IN("1.2.840.113549.1.1.1", "rsaEncryption");
    _IN("1.2.840.113549.1.1.4", "md5WithRSAEncryption");
    _IN("1.2.840.113549.1.1.5", "sha1WithRSAEncryption");
    _IN("1.2.840.113549.1.1.7", "RSAES-OAEP");
    _IN("1.2.840.113549.1.1.8", "mgf1");
    _IN("1.2.840.113549.1.1.9", "pSpecified");
    _IN("1.2.840.113549.1.1.10", "RSASSA-PSS");
    _IN("1.2.840.113549.1.1.11", "sha256WithRSAEncryption");
    _IN("1.2.840.113549.1.1.12", "sha384WithRSAEncryption");
    _IN("1.2.840.113549.1.1.13", "sha512WithRSAEncryption");
    _IN("1.3.101.112", "EdDSA25519");
    _IN("1.2.840.10040.4.3", "dsa-with-sha1");
    _IN("1.3.14.3.2.7", "desCBC");
    _IN("1.3.14.3.2.26", "sha1");
    _IN("1.3.14.3.2.29", "sha1WithRSASignature");
    _IN("2.16.840.1.101.3.4.2.1", "sha256");
    _IN("2.16.840.1.101.3.4.2.2", "sha384");
    _IN("2.16.840.1.101.3.4.2.3", "sha512");
    _IN("2.16.840.1.101.3.4.2.4", "sha224");
    _IN("2.16.840.1.101.3.4.2.5", "sha512-224");
    _IN("2.16.840.1.101.3.4.2.6", "sha512-256");
    _IN("1.2.840.113549.2.2", "md2");
    _IN("1.2.840.113549.2.5", "md5");
    _IN("1.2.840.113549.1.7.1", "data");
    _IN("1.2.840.113549.1.7.2", "signedData");
    _IN("1.2.840.113549.1.7.3", "envelopedData");
    _IN("1.2.840.113549.1.7.4", "signedAndEnvelopedData");
    _IN("1.2.840.113549.1.7.5", "digestedData");
    _IN("1.2.840.113549.1.7.6", "encryptedData");
    _IN("1.2.840.113549.1.9.1", "emailAddress");
    _IN("1.2.840.113549.1.9.2", "unstructuredName");
    _IN("1.2.840.113549.1.9.3", "contentType");
    _IN("1.2.840.113549.1.9.4", "messageDigest");
    _IN("1.2.840.113549.1.9.5", "signingTime");
    _IN("1.2.840.113549.1.9.6", "counterSignature");
    _IN("1.2.840.113549.1.9.7", "challengePassword");
    _IN("1.2.840.113549.1.9.8", "unstructuredAddress");
    _IN("1.2.840.113549.1.9.14", "extensionRequest");
    _IN("1.2.840.113549.1.9.20", "friendlyName");
    _IN("1.2.840.113549.1.9.21", "localKeyId");
    _IN("1.2.840.113549.1.9.22.1", "x509Certificate");
    _IN("1.2.840.113549.1.12.10.1.1", "keyBag");
    _IN("1.2.840.113549.1.12.10.1.2", "pkcs8ShroudedKeyBag");
    _IN("1.2.840.113549.1.12.10.1.3", "certBag");
    _IN("1.2.840.113549.1.12.10.1.4", "crlBag");
    _IN("1.2.840.113549.1.12.10.1.5", "secretBag");
    _IN("1.2.840.113549.1.12.10.1.6", "safeContentsBag");
    _IN("1.2.840.113549.1.5.13", "pkcs5PBES2");
    _IN("1.2.840.113549.1.5.12", "pkcs5PBKDF2");
    _IN("1.2.840.113549.1.12.1.1", "pbeWithSHAAnd128BitRC4");
    _IN("1.2.840.113549.1.12.1.2", "pbeWithSHAAnd40BitRC4");
    _IN("1.2.840.113549.1.12.1.3", "pbeWithSHAAnd3-KeyTripleDES-CBC");
    _IN("1.2.840.113549.1.12.1.4", "pbeWithSHAAnd2-KeyTripleDES-CBC");
    _IN("1.2.840.113549.1.12.1.5", "pbeWithSHAAnd128BitRC2-CBC");
    _IN("1.2.840.113549.1.12.1.6", "pbewithSHAAnd40BitRC2-CBC");
    _IN("1.2.840.113549.2.7", "hmacWithSHA1");
    _IN("1.2.840.113549.2.8", "hmacWithSHA224");
    _IN("1.2.840.113549.2.9", "hmacWithSHA256");
    _IN("1.2.840.113549.2.10", "hmacWithSHA384");
    _IN("1.2.840.113549.2.11", "hmacWithSHA512");
    _IN("1.2.840.113549.3.7", "des-EDE3-CBC");
    _IN("2.16.840.1.101.3.4.1.2", "aes128-CBC");
    _IN("2.16.840.1.101.3.4.1.22", "aes192-CBC");
    _IN("2.16.840.1.101.3.4.1.42", "aes256-CBC");
    _IN("2.5.4.3", "commonName");
    _IN("2.5.4.4", "surname");
    _IN("2.5.4.5", "serialNumber");
    _IN("2.5.4.6", "countryName");
    _IN("2.5.4.7", "localityName");
    _IN("2.5.4.8", "stateOrProvinceName");
    _IN("2.5.4.9", "streetAddress");
    _IN("2.5.4.10", "organizationName");
    _IN("2.5.4.11", "organizationalUnitName");
    _IN("2.5.4.12", "title");
    _IN("2.5.4.13", "description");
    _IN("2.5.4.15", "businessCategory");
    _IN("2.5.4.17", "postalCode");
    _IN("2.5.4.42", "givenName");
    _IN("1.3.6.1.4.1.311.60.2.1.2", "jurisdictionOfIncorporationStateOrProvinceName");
    _IN("1.3.6.1.4.1.311.60.2.1.3", "jurisdictionOfIncorporationCountryName");
    _IN("2.16.840.1.113730.1.1", "nsCertType");
    _IN("2.16.840.1.113730.1.13", "nsComment");
    _I_("2.5.29.1", "authorityKeyIdentifier");
    _I_("2.5.29.2", "keyAttributes");
    _I_("2.5.29.3", "certificatePolicies");
    _I_("2.5.29.4", "keyUsageRestriction");
    _I_("2.5.29.5", "policyMapping");
    _I_("2.5.29.6", "subtreesConstraint");
    _I_("2.5.29.7", "subjectAltName");
    _I_("2.5.29.8", "issuerAltName");
    _I_("2.5.29.9", "subjectDirectoryAttributes");
    _I_("2.5.29.10", "basicConstraints");
    _I_("2.5.29.11", "nameConstraints");
    _I_("2.5.29.12", "policyConstraints");
    _I_("2.5.29.13", "basicConstraints");
    _IN("2.5.29.14", "subjectKeyIdentifier");
    _IN("2.5.29.15", "keyUsage");
    _I_("2.5.29.16", "privateKeyUsagePeriod");
    _IN("2.5.29.17", "subjectAltName");
    _IN("2.5.29.18", "issuerAltName");
    _IN("2.5.29.19", "basicConstraints");
    _I_("2.5.29.20", "cRLNumber");
    _I_("2.5.29.21", "cRLReason");
    _I_("2.5.29.22", "expirationDate");
    _I_("2.5.29.23", "instructionCode");
    _I_("2.5.29.24", "invalidityDate");
    _I_("2.5.29.25", "cRLDistributionPoints");
    _I_("2.5.29.26", "issuingDistributionPoint");
    _I_("2.5.29.27", "deltaCRLIndicator");
    _I_("2.5.29.28", "issuingDistributionPoint");
    _I_("2.5.29.29", "certificateIssuer");
    _I_("2.5.29.30", "nameConstraints");
    _IN("2.5.29.31", "cRLDistributionPoints");
    _IN("2.5.29.32", "certificatePolicies");
    _I_("2.5.29.33", "policyMappings");
    _I_("2.5.29.34", "policyConstraints");
    _IN("2.5.29.35", "authorityKeyIdentifier");
    _I_("2.5.29.36", "policyConstraints");
    _IN("2.5.29.37", "extKeyUsage");
    _I_("2.5.29.46", "freshestCRL");
    _I_("2.5.29.54", "inhibitAnyPolicy");
    _IN("1.3.6.1.4.1.11129.2.4.2", "timestampList");
    _IN("1.3.6.1.5.5.7.1.1", "authorityInfoAccess");
    _IN("1.3.6.1.5.5.7.3.1", "serverAuth");
    _IN("1.3.6.1.5.5.7.3.2", "clientAuth");
    _IN("1.3.6.1.5.5.7.3.3", "codeSigning");
    _IN("1.3.6.1.5.5.7.3.4", "emailProtection");
    _IN("1.3.6.1.5.5.7.3.8", "timeStamping");
  }
});

// node_modules/node-forge/lib/asn1.js
var require_asn1 = __commonJS({
  "node_modules/node-forge/lib/asn1.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    require_oids();
    var asn1 = module2.exports = forge.asn1 = forge.asn1 || {};
    asn1.Class = {
      UNIVERSAL: 0,
      APPLICATION: 64,
      CONTEXT_SPECIFIC: 128,
      PRIVATE: 192
    };
    asn1.Type = {
      NONE: 0,
      BOOLEAN: 1,
      INTEGER: 2,
      BITSTRING: 3,
      OCTETSTRING: 4,
      NULL: 5,
      OID: 6,
      ODESC: 7,
      EXTERNAL: 8,
      REAL: 9,
      ENUMERATED: 10,
      EMBEDDED: 11,
      UTF8: 12,
      ROID: 13,
      SEQUENCE: 16,
      SET: 17,
      PRINTABLESTRING: 19,
      IA5STRING: 22,
      UTCTIME: 23,
      GENERALIZEDTIME: 24,
      BMPSTRING: 30
    };
    asn1.create = function(tagClass, type, constructed, value, options) {
      if (forge.util.isArray(value)) {
        var tmp = [];
        for (var i = 0; i < value.length; ++i) {
          if (value[i] !== void 0) {
            tmp.push(value[i]);
          }
        }
        value = tmp;
      }
      var obj = {
        tagClass,
        type,
        constructed,
        composed: constructed || forge.util.isArray(value),
        value
      };
      if (options && "bitStringContents" in options) {
        obj.bitStringContents = options.bitStringContents;
        obj.original = asn1.copy(obj);
      }
      return obj;
    };
    asn1.copy = function(obj, options) {
      var copy;
      if (forge.util.isArray(obj)) {
        copy = [];
        for (var i = 0; i < obj.length; ++i) {
          copy.push(asn1.copy(obj[i], options));
        }
        return copy;
      }
      if (typeof obj === "string") {
        return obj;
      }
      copy = {
        tagClass: obj.tagClass,
        type: obj.type,
        constructed: obj.constructed,
        composed: obj.composed,
        value: asn1.copy(obj.value, options)
      };
      if (options && !options.excludeBitStringContents) {
        copy.bitStringContents = obj.bitStringContents;
      }
      return copy;
    };
    asn1.equals = function(obj1, obj2, options) {
      if (forge.util.isArray(obj1)) {
        if (!forge.util.isArray(obj2)) {
          return false;
        }
        if (obj1.length !== obj2.length) {
          return false;
        }
        for (var i = 0; i < obj1.length; ++i) {
          if (!asn1.equals(obj1[i], obj2[i])) {
            return false;
          }
        }
        return true;
      }
      if (typeof obj1 !== typeof obj2) {
        return false;
      }
      if (typeof obj1 === "string") {
        return obj1 === obj2;
      }
      var equal = obj1.tagClass === obj2.tagClass && obj1.type === obj2.type && obj1.constructed === obj2.constructed && obj1.composed === obj2.composed && asn1.equals(obj1.value, obj2.value);
      if (options && options.includeBitStringContents) {
        equal = equal && obj1.bitStringContents === obj2.bitStringContents;
      }
      return equal;
    };
    asn1.getBerValueLength = function(b2) {
      var b22 = b2.getByte();
      if (b22 === 128) {
        return void 0;
      }
      var length2;
      var longForm = b22 & 128;
      if (!longForm) {
        length2 = b22;
      } else {
        length2 = b2.getInt((b22 & 127) << 3);
      }
      return length2;
    };
    function _checkBufferLength(bytes, remaining, n2) {
      if (n2 > remaining) {
        var error = new Error("Too few bytes to parse DER.");
        error.available = bytes.length();
        error.remaining = remaining;
        error.requested = n2;
        throw error;
      }
    }
    var _getValueLength = function(bytes, remaining) {
      var b2 = bytes.getByte();
      remaining--;
      if (b2 === 128) {
        return void 0;
      }
      var length2;
      var longForm = b2 & 128;
      if (!longForm) {
        length2 = b2;
      } else {
        var longFormBytes = b2 & 127;
        _checkBufferLength(bytes, remaining, longFormBytes);
        length2 = bytes.getInt(longFormBytes << 3);
      }
      if (length2 < 0) {
        throw new Error("Negative length: " + length2);
      }
      return length2;
    };
    asn1.fromDer = function(bytes, options) {
      if (options === void 0) {
        options = {
          strict: true,
          parseAllBytes: true,
          decodeBitStrings: true
        };
      }
      if (typeof options === "boolean") {
        options = {
          strict: options,
          parseAllBytes: true,
          decodeBitStrings: true
        };
      }
      if (!("strict" in options)) {
        options.strict = true;
      }
      if (!("parseAllBytes" in options)) {
        options.parseAllBytes = true;
      }
      if (!("decodeBitStrings" in options)) {
        options.decodeBitStrings = true;
      }
      if (typeof bytes === "string") {
        bytes = forge.util.createBuffer(bytes);
      }
      var byteCount = bytes.length();
      var value = _fromDer(bytes, bytes.length(), 0, options);
      if (options.parseAllBytes && bytes.length() !== 0) {
        var error = new Error("Unparsed DER bytes remain after ASN.1 parsing.");
        error.byteCount = byteCount;
        error.remaining = bytes.length();
        throw error;
      }
      return value;
    };
    function _fromDer(bytes, remaining, depth, options) {
      var start;
      _checkBufferLength(bytes, remaining, 2);
      var b1 = bytes.getByte();
      remaining--;
      var tagClass = b1 & 192;
      var type = b1 & 31;
      start = bytes.length();
      var length2 = _getValueLength(bytes, remaining);
      remaining -= start - bytes.length();
      if (length2 !== void 0 && length2 > remaining) {
        if (options.strict) {
          var error = new Error("Too few bytes to read ASN.1 value.");
          error.available = bytes.length();
          error.remaining = remaining;
          error.requested = length2;
          throw error;
        }
        length2 = remaining;
      }
      var value;
      var bitStringContents;
      var constructed = (b1 & 32) === 32;
      if (constructed) {
        value = [];
        if (length2 === void 0) {
          for (; ; ) {
            _checkBufferLength(bytes, remaining, 2);
            if (bytes.bytes(2) === String.fromCharCode(0, 0)) {
              bytes.getBytes(2);
              remaining -= 2;
              break;
            }
            start = bytes.length();
            value.push(_fromDer(bytes, remaining, depth + 1, options));
            remaining -= start - bytes.length();
          }
        } else {
          while (length2 > 0) {
            start = bytes.length();
            value.push(_fromDer(bytes, length2, depth + 1, options));
            remaining -= start - bytes.length();
            length2 -= start - bytes.length();
          }
        }
      }
      if (value === void 0 && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING) {
        bitStringContents = bytes.bytes(length2);
      }
      if (value === void 0 && options.decodeBitStrings && tagClass === asn1.Class.UNIVERSAL && // FIXME: OCTET STRINGs not yet supported here
      // .. other parts of forge expect to decode OCTET STRINGs manually
      type === asn1.Type.BITSTRING && length2 > 1) {
        var savedRead = bytes.read;
        var savedRemaining = remaining;
        var unused = 0;
        if (type === asn1.Type.BITSTRING) {
          _checkBufferLength(bytes, remaining, 1);
          unused = bytes.getByte();
          remaining--;
        }
        if (unused === 0) {
          try {
            start = bytes.length();
            var subOptions = {
              // enforce strict mode to avoid parsing ASN.1 from plain data
              strict: true,
              decodeBitStrings: true
            };
            var composed = _fromDer(bytes, remaining, depth + 1, subOptions);
            var used = start - bytes.length();
            remaining -= used;
            if (type == asn1.Type.BITSTRING) {
              used++;
            }
            var tc = composed.tagClass;
            if (used === length2 && (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC)) {
              value = [composed];
            }
          } catch (ex) {
          }
        }
        if (value === void 0) {
          bytes.read = savedRead;
          remaining = savedRemaining;
        }
      }
      if (value === void 0) {
        if (length2 === void 0) {
          if (options.strict) {
            throw new Error("Non-constructed ASN.1 object of indefinite length.");
          }
          length2 = remaining;
        }
        if (type === asn1.Type.BMPSTRING) {
          value = "";
          for (; length2 > 0; length2 -= 2) {
            _checkBufferLength(bytes, remaining, 2);
            value += String.fromCharCode(bytes.getInt16());
            remaining -= 2;
          }
        } else {
          value = bytes.getBytes(length2);
          remaining -= length2;
        }
      }
      var asn1Options = bitStringContents === void 0 ? null : {
        bitStringContents
      };
      return asn1.create(tagClass, type, constructed, value, asn1Options);
    }
    asn1.toDer = function(obj) {
      var bytes = forge.util.createBuffer();
      var b1 = obj.tagClass | obj.type;
      var value = forge.util.createBuffer();
      var useBitStringContents = false;
      if ("bitStringContents" in obj) {
        useBitStringContents = true;
        if (obj.original) {
          useBitStringContents = asn1.equals(obj, obj.original);
        }
      }
      if (useBitStringContents) {
        value.putBytes(obj.bitStringContents);
      } else if (obj.composed) {
        if (obj.constructed) {
          b1 |= 32;
        } else {
          value.putByte(0);
        }
        for (var i = 0; i < obj.value.length; ++i) {
          if (obj.value[i] !== void 0) {
            value.putBuffer(asn1.toDer(obj.value[i]));
          }
        }
      } else {
        if (obj.type === asn1.Type.BMPSTRING) {
          for (var i = 0; i < obj.value.length; ++i) {
            value.putInt16(obj.value.charCodeAt(i));
          }
        } else {
          if (obj.type === asn1.Type.INTEGER && obj.value.length > 1 && // leading 0x00 for positive integer
          (obj.value.charCodeAt(0) === 0 && (obj.value.charCodeAt(1) & 128) === 0 || // leading 0xFF for negative integer
          obj.value.charCodeAt(0) === 255 && (obj.value.charCodeAt(1) & 128) === 128)) {
            value.putBytes(obj.value.substr(1));
          } else {
            value.putBytes(obj.value);
          }
        }
      }
      bytes.putByte(b1);
      if (value.length() <= 127) {
        bytes.putByte(value.length() & 127);
      } else {
        var len = value.length();
        var lenBytes = "";
        do {
          lenBytes += String.fromCharCode(len & 255);
          len = len >>> 8;
        } while (len > 0);
        bytes.putByte(lenBytes.length | 128);
        for (var i = lenBytes.length - 1; i >= 0; --i) {
          bytes.putByte(lenBytes.charCodeAt(i));
        }
      }
      bytes.putBuffer(value);
      return bytes;
    };
    asn1.oidToDer = function(oid) {
      var values = oid.split(".");
      var bytes = forge.util.createBuffer();
      bytes.putByte(40 * parseInt(values[0], 10) + parseInt(values[1], 10));
      var last, valueBytes, value, b2;
      for (var i = 2; i < values.length; ++i) {
        last = true;
        valueBytes = [];
        value = parseInt(values[i], 10);
        do {
          b2 = value & 127;
          value = value >>> 7;
          if (!last) {
            b2 |= 128;
          }
          valueBytes.push(b2);
          last = false;
        } while (value > 0);
        for (var n2 = valueBytes.length - 1; n2 >= 0; --n2) {
          bytes.putByte(valueBytes[n2]);
        }
      }
      return bytes;
    };
    asn1.derToOid = function(bytes) {
      var oid;
      if (typeof bytes === "string") {
        bytes = forge.util.createBuffer(bytes);
      }
      var b2 = bytes.getByte();
      oid = Math.floor(b2 / 40) + "." + b2 % 40;
      var value = 0;
      while (bytes.length() > 0) {
        b2 = bytes.getByte();
        value = value << 7;
        if (b2 & 128) {
          value += b2 & 127;
        } else {
          oid += "." + (value + b2);
          value = 0;
        }
      }
      return oid;
    };
    asn1.utcTimeToDate = function(utc) {
      var date = /* @__PURE__ */ new Date();
      var year = parseInt(utc.substr(0, 2), 10);
      year = year >= 50 ? 1900 + year : 2e3 + year;
      var MM = parseInt(utc.substr(2, 2), 10) - 1;
      var DD = parseInt(utc.substr(4, 2), 10);
      var hh = parseInt(utc.substr(6, 2), 10);
      var mm = parseInt(utc.substr(8, 2), 10);
      var ss = 0;
      if (utc.length > 11) {
        var c = utc.charAt(10);
        var end = 10;
        if (c !== "+" && c !== "-") {
          ss = parseInt(utc.substr(10, 2), 10);
          end += 2;
        }
      }
      date.setUTCFullYear(year, MM, DD);
      date.setUTCHours(hh, mm, ss, 0);
      if (end) {
        c = utc.charAt(end);
        if (c === "+" || c === "-") {
          var hhoffset = parseInt(utc.substr(end + 1, 2), 10);
          var mmoffset = parseInt(utc.substr(end + 4, 2), 10);
          var offset = hhoffset * 60 + mmoffset;
          offset *= 6e4;
          if (c === "+") {
            date.setTime(+date - offset);
          } else {
            date.setTime(+date + offset);
          }
        }
      }
      return date;
    };
    asn1.generalizedTimeToDate = function(gentime) {
      var date = /* @__PURE__ */ new Date();
      var YYYY = parseInt(gentime.substr(0, 4), 10);
      var MM = parseInt(gentime.substr(4, 2), 10) - 1;
      var DD = parseInt(gentime.substr(6, 2), 10);
      var hh = parseInt(gentime.substr(8, 2), 10);
      var mm = parseInt(gentime.substr(10, 2), 10);
      var ss = parseInt(gentime.substr(12, 2), 10);
      var fff = 0;
      var offset = 0;
      var isUTC = false;
      if (gentime.charAt(gentime.length - 1) === "Z") {
        isUTC = true;
      }
      var end = gentime.length - 5, c = gentime.charAt(end);
      if (c === "+" || c === "-") {
        var hhoffset = parseInt(gentime.substr(end + 1, 2), 10);
        var mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
        offset = hhoffset * 60 + mmoffset;
        offset *= 6e4;
        if (c === "+") {
          offset *= -1;
        }
        isUTC = true;
      }
      if (gentime.charAt(14) === ".") {
        fff = parseFloat(gentime.substr(14), 10) * 1e3;
      }
      if (isUTC) {
        date.setUTCFullYear(YYYY, MM, DD);
        date.setUTCHours(hh, mm, ss, fff);
        date.setTime(+date + offset);
      } else {
        date.setFullYear(YYYY, MM, DD);
        date.setHours(hh, mm, ss, fff);
      }
      return date;
    };
    asn1.dateToUtcTime = function(date) {
      if (typeof date === "string") {
        return date;
      }
      var rval = "";
      var format = [];
      format.push(("" + date.getUTCFullYear()).substr(2));
      format.push("" + (date.getUTCMonth() + 1));
      format.push("" + date.getUTCDate());
      format.push("" + date.getUTCHours());
      format.push("" + date.getUTCMinutes());
      format.push("" + date.getUTCSeconds());
      for (var i = 0; i < format.length; ++i) {
        if (format[i].length < 2) {
          rval += "0";
        }
        rval += format[i];
      }
      rval += "Z";
      return rval;
    };
    asn1.dateToGeneralizedTime = function(date) {
      if (typeof date === "string") {
        return date;
      }
      var rval = "";
      var format = [];
      format.push("" + date.getUTCFullYear());
      format.push("" + (date.getUTCMonth() + 1));
      format.push("" + date.getUTCDate());
      format.push("" + date.getUTCHours());
      format.push("" + date.getUTCMinutes());
      format.push("" + date.getUTCSeconds());
      for (var i = 0; i < format.length; ++i) {
        if (format[i].length < 2) {
          rval += "0";
        }
        rval += format[i];
      }
      rval += "Z";
      return rval;
    };
    asn1.integerToDer = function(x) {
      var rval = forge.util.createBuffer();
      if (x >= -128 && x < 128) {
        return rval.putSignedInt(x, 8);
      }
      if (x >= -32768 && x < 32768) {
        return rval.putSignedInt(x, 16);
      }
      if (x >= -8388608 && x < 8388608) {
        return rval.putSignedInt(x, 24);
      }
      if (x >= -2147483648 && x < 2147483648) {
        return rval.putSignedInt(x, 32);
      }
      var error = new Error("Integer too large; max is 32-bits.");
      error.integer = x;
      throw error;
    };
    asn1.derToInteger = function(bytes) {
      if (typeof bytes === "string") {
        bytes = forge.util.createBuffer(bytes);
      }
      var n2 = bytes.length() * 8;
      if (n2 > 32) {
        throw new Error("Integer too large; max is 32-bits.");
      }
      return bytes.getSignedInt(n2);
    };
    asn1.validate = function(obj, v2, capture, errors) {
      var rval = false;
      if ((obj.tagClass === v2.tagClass || typeof v2.tagClass === "undefined") && (obj.type === v2.type || typeof v2.type === "undefined")) {
        if (obj.constructed === v2.constructed || typeof v2.constructed === "undefined") {
          rval = true;
          if (v2.value && forge.util.isArray(v2.value)) {
            var j = 0;
            for (var i = 0; rval && i < v2.value.length; ++i) {
              rval = v2.value[i].optional || false;
              if (obj.value[j]) {
                rval = asn1.validate(obj.value[j], v2.value[i], capture, errors);
                if (rval) {
                  ++j;
                } else if (v2.value[i].optional) {
                  rval = true;
                }
              }
              if (!rval && errors) {
                errors.push(
                  "[" + v2.name + '] Tag class "' + v2.tagClass + '", type "' + v2.type + '" expected value length "' + v2.value.length + '", got "' + obj.value.length + '"'
                );
              }
            }
          }
          if (rval && capture) {
            if (v2.capture) {
              capture[v2.capture] = obj.value;
            }
            if (v2.captureAsn1) {
              capture[v2.captureAsn1] = obj;
            }
            if (v2.captureBitStringContents && "bitStringContents" in obj) {
              capture[v2.captureBitStringContents] = obj.bitStringContents;
            }
            if (v2.captureBitStringValue && "bitStringContents" in obj) {
              var value;
              if (obj.bitStringContents.length < 2) {
                capture[v2.captureBitStringValue] = "";
              } else {
                var unused = obj.bitStringContents.charCodeAt(0);
                if (unused !== 0) {
                  throw new Error(
                    "captureBitStringValue only supported for zero unused bits"
                  );
                }
                capture[v2.captureBitStringValue] = obj.bitStringContents.slice(1);
              }
            }
          }
        } else if (errors) {
          errors.push(
            "[" + v2.name + '] Expected constructed "' + v2.constructed + '", got "' + obj.constructed + '"'
          );
        }
      } else if (errors) {
        if (obj.tagClass !== v2.tagClass) {
          errors.push(
            "[" + v2.name + '] Expected tag class "' + v2.tagClass + '", got "' + obj.tagClass + '"'
          );
        }
        if (obj.type !== v2.type) {
          errors.push(
            "[" + v2.name + '] Expected type "' + v2.type + '", got "' + obj.type + '"'
          );
        }
      }
      return rval;
    };
    var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
    asn1.prettyPrint = function(obj, level, indentation) {
      var rval = "";
      level = level || 0;
      indentation = indentation || 2;
      if (level > 0) {
        rval += "\n";
      }
      var indent = "";
      for (var i = 0; i < level * indentation; ++i) {
        indent += " ";
      }
      rval += indent + "Tag: ";
      switch (obj.tagClass) {
        case asn1.Class.UNIVERSAL:
          rval += "Universal:";
          break;
        case asn1.Class.APPLICATION:
          rval += "Application:";
          break;
        case asn1.Class.CONTEXT_SPECIFIC:
          rval += "Context-Specific:";
          break;
        case asn1.Class.PRIVATE:
          rval += "Private:";
          break;
      }
      if (obj.tagClass === asn1.Class.UNIVERSAL) {
        rval += obj.type;
        switch (obj.type) {
          case asn1.Type.NONE:
            rval += " (None)";
            break;
          case asn1.Type.BOOLEAN:
            rval += " (Boolean)";
            break;
          case asn1.Type.INTEGER:
            rval += " (Integer)";
            break;
          case asn1.Type.BITSTRING:
            rval += " (Bit string)";
            break;
          case asn1.Type.OCTETSTRING:
            rval += " (Octet string)";
            break;
          case asn1.Type.NULL:
            rval += " (Null)";
            break;
          case asn1.Type.OID:
            rval += " (Object Identifier)";
            break;
          case asn1.Type.ODESC:
            rval += " (Object Descriptor)";
            break;
          case asn1.Type.EXTERNAL:
            rval += " (External or Instance of)";
            break;
          case asn1.Type.REAL:
            rval += " (Real)";
            break;
          case asn1.Type.ENUMERATED:
            rval += " (Enumerated)";
            break;
          case asn1.Type.EMBEDDED:
            rval += " (Embedded PDV)";
            break;
          case asn1.Type.UTF8:
            rval += " (UTF8)";
            break;
          case asn1.Type.ROID:
            rval += " (Relative Object Identifier)";
            break;
          case asn1.Type.SEQUENCE:
            rval += " (Sequence)";
            break;
          case asn1.Type.SET:
            rval += " (Set)";
            break;
          case asn1.Type.PRINTABLESTRING:
            rval += " (Printable String)";
            break;
          case asn1.Type.IA5String:
            rval += " (IA5String (ASCII))";
            break;
          case asn1.Type.UTCTIME:
            rval += " (UTC time)";
            break;
          case asn1.Type.GENERALIZEDTIME:
            rval += " (Generalized time)";
            break;
          case asn1.Type.BMPSTRING:
            rval += " (BMP String)";
            break;
        }
      } else {
        rval += obj.type;
      }
      rval += "\n";
      rval += indent + "Constructed: " + obj.constructed + "\n";
      if (obj.composed) {
        var subvalues = 0;
        var sub = "";
        for (var i = 0; i < obj.value.length; ++i) {
          if (obj.value[i] !== void 0) {
            subvalues += 1;
            sub += asn1.prettyPrint(obj.value[i], level + 1, indentation);
            if (i + 1 < obj.value.length) {
              sub += ",";
            }
          }
        }
        rval += indent + "Sub values: " + subvalues + sub;
      } else {
        rval += indent + "Value: ";
        if (obj.type === asn1.Type.OID) {
          var oid = asn1.derToOid(obj.value);
          rval += oid;
          if (forge.pki && forge.pki.oids) {
            if (oid in forge.pki.oids) {
              rval += " (" + forge.pki.oids[oid] + ") ";
            }
          }
        }
        if (obj.type === asn1.Type.INTEGER) {
          try {
            rval += asn1.derToInteger(obj.value);
          } catch (ex) {
            rval += "0x" + forge.util.bytesToHex(obj.value);
          }
        } else if (obj.type === asn1.Type.BITSTRING) {
          if (obj.value.length > 1) {
            rval += "0x" + forge.util.bytesToHex(obj.value.slice(1));
          } else {
            rval += "(none)";
          }
          if (obj.value.length > 0) {
            var unused = obj.value.charCodeAt(0);
            if (unused == 1) {
              rval += " (1 unused bit shown)";
            } else if (unused > 1) {
              rval += " (" + unused + " unused bits shown)";
            }
          }
        } else if (obj.type === asn1.Type.OCTETSTRING) {
          if (!_nonLatinRegex.test(obj.value)) {
            rval += "(" + obj.value + ") ";
          }
          rval += "0x" + forge.util.bytesToHex(obj.value);
        } else if (obj.type === asn1.Type.UTF8) {
          try {
            rval += forge.util.decodeUtf8(obj.value);
          } catch (e2) {
            if (e2.message === "URI malformed") {
              rval += "0x" + forge.util.bytesToHex(obj.value) + " (malformed UTF8)";
            } else {
              throw e2;
            }
          }
        } else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String) {
          rval += obj.value;
        } else if (_nonLatinRegex.test(obj.value)) {
          rval += "0x" + forge.util.bytesToHex(obj.value);
        } else if (obj.value.length === 0) {
          rval += "[null]";
        } else {
          rval += obj.value;
        }
      }
      return rval;
    };
  }
});

// node_modules/node-forge/lib/des.js
var require_des = __commonJS({
  "node_modules/node-forge/lib/des.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_cipher();
    require_cipherModes();
    require_util();
    module2.exports = forge.des = forge.des || {};
    forge.des.startEncrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key,
        output,
        decrypt: false,
        mode: mode || (iv === null ? "ECB" : "CBC")
      });
      cipher.start(iv);
      return cipher;
    };
    forge.des.createEncryptionCipher = function(key, mode) {
      return _createCipher({
        key,
        output: null,
        decrypt: false,
        mode
      });
    };
    forge.des.startDecrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key,
        output,
        decrypt: true,
        mode: mode || (iv === null ? "ECB" : "CBC")
      });
      cipher.start(iv);
      return cipher;
    };
    forge.des.createDecryptionCipher = function(key, mode) {
      return _createCipher({
        key,
        output: null,
        decrypt: true,
        mode
      });
    };
    forge.des.Algorithm = function(name2, mode) {
      var self2 = this;
      self2.name = name2;
      self2.mode = new mode({
        blockSize: 8,
        cipher: {
          encrypt: function(inBlock, outBlock) {
            return _updateBlock(self2._keys, inBlock, outBlock, false);
          },
          decrypt: function(inBlock, outBlock) {
            return _updateBlock(self2._keys, inBlock, outBlock, true);
          }
        }
      });
      self2._init = false;
    };
    forge.des.Algorithm.prototype.initialize = function(options) {
      if (this._init) {
        return;
      }
      var key = forge.util.createBuffer(options.key);
      if (this.name.indexOf("3DES") === 0) {
        if (key.length() !== 24) {
          throw new Error("Invalid Triple-DES key size: " + key.length() * 8);
        }
      }
      this._keys = _createKeys(key);
      this._init = true;
    };
    registerAlgorithm("DES-ECB", forge.cipher.modes.ecb);
    registerAlgorithm("DES-CBC", forge.cipher.modes.cbc);
    registerAlgorithm("DES-CFB", forge.cipher.modes.cfb);
    registerAlgorithm("DES-OFB", forge.cipher.modes.ofb);
    registerAlgorithm("DES-CTR", forge.cipher.modes.ctr);
    registerAlgorithm("3DES-ECB", forge.cipher.modes.ecb);
    registerAlgorithm("3DES-CBC", forge.cipher.modes.cbc);
    registerAlgorithm("3DES-CFB", forge.cipher.modes.cfb);
    registerAlgorithm("3DES-OFB", forge.cipher.modes.ofb);
    registerAlgorithm("3DES-CTR", forge.cipher.modes.ctr);
    function registerAlgorithm(name2, mode) {
      var factory = function() {
        return new forge.des.Algorithm(name2, mode);
      };
      forge.cipher.registerAlgorithm(name2, factory);
    }
    var spfunction1 = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756];
    var spfunction2 = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344];
    var spfunction3 = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584];
    var spfunction4 = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928];
    var spfunction5 = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080];
    var spfunction6 = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312];
    var spfunction7 = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154];
    var spfunction8 = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696];
    function _createKeys(key) {
      var pc2bytes0 = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], pc2bytes1 = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], pc2bytes2 = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], pc2bytes3 = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], pc2bytes4 = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], pc2bytes5 = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], pc2bytes6 = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], pc2bytes7 = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], pc2bytes8 = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], pc2bytes9 = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], pc2bytes10 = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], pc2bytes11 = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], pc2bytes12 = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], pc2bytes13 = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261];
      var iterations = key.length() > 8 ? 3 : 1;
      var keys = [];
      var shifts = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];
      var n2 = 0, tmp;
      for (var j = 0; j < iterations; j++) {
        var left = key.getInt32();
        var right = key.getInt32();
        tmp = (left >>> 4 ^ right) & 252645135;
        right ^= tmp;
        left ^= tmp << 4;
        tmp = (right >>> -16 ^ left) & 65535;
        left ^= tmp;
        right ^= tmp << -16;
        tmp = (left >>> 2 ^ right) & 858993459;
        right ^= tmp;
        left ^= tmp << 2;
        tmp = (right >>> -16 ^ left) & 65535;
        left ^= tmp;
        right ^= tmp << -16;
        tmp = (left >>> 1 ^ right) & 1431655765;
        right ^= tmp;
        left ^= tmp << 1;
        tmp = (right >>> 8 ^ left) & 16711935;
        left ^= tmp;
        right ^= tmp << 8;
        tmp = (left >>> 1 ^ right) & 1431655765;
        right ^= tmp;
        left ^= tmp << 1;
        tmp = left << 8 | right >>> 20 & 240;
        left = right << 24 | right << 8 & 16711680 | right >>> 8 & 65280 | right >>> 24 & 240;
        right = tmp;
        for (var i = 0; i < shifts.length; ++i) {
          if (shifts[i]) {
            left = left << 2 | left >>> 26;
            right = right << 2 | right >>> 26;
          } else {
            left = left << 1 | left >>> 27;
            right = right << 1 | right >>> 27;
          }
          left &= -15;
          right &= -15;
          var lefttmp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 15] | pc2bytes2[left >>> 20 & 15] | pc2bytes3[left >>> 16 & 15] | pc2bytes4[left >>> 12 & 15] | pc2bytes5[left >>> 8 & 15] | pc2bytes6[left >>> 4 & 15];
          var righttmp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 15] | pc2bytes9[right >>> 20 & 15] | pc2bytes10[right >>> 16 & 15] | pc2bytes11[right >>> 12 & 15] | pc2bytes12[right >>> 8 & 15] | pc2bytes13[right >>> 4 & 15];
          tmp = (righttmp >>> 16 ^ lefttmp) & 65535;
          keys[n2++] = lefttmp ^ tmp;
          keys[n2++] = righttmp ^ tmp << 16;
        }
      }
      return keys;
    }
    function _updateBlock(keys, input, output, decrypt) {
      var iterations = keys.length === 32 ? 3 : 9;
      var looping;
      if (iterations === 3) {
        looping = decrypt ? [30, -2, -2] : [0, 32, 2];
      } else {
        looping = decrypt ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];
      }
      var tmp;
      var left = input[0];
      var right = input[1];
      tmp = (left >>> 4 ^ right) & 252645135;
      right ^= tmp;
      left ^= tmp << 4;
      tmp = (left >>> 16 ^ right) & 65535;
      right ^= tmp;
      left ^= tmp << 16;
      tmp = (right >>> 2 ^ left) & 858993459;
      left ^= tmp;
      right ^= tmp << 2;
      tmp = (right >>> 8 ^ left) & 16711935;
      left ^= tmp;
      right ^= tmp << 8;
      tmp = (left >>> 1 ^ right) & 1431655765;
      right ^= tmp;
      left ^= tmp << 1;
      left = left << 1 | left >>> 31;
      right = right << 1 | right >>> 31;
      for (var j = 0; j < iterations; j += 3) {
        var endloop = looping[j + 1];
        var loopinc = looping[j + 2];
        for (var i = looping[j]; i != endloop; i += loopinc) {
          var right1 = right ^ keys[i];
          var right2 = (right >>> 4 | right << 28) ^ keys[i + 1];
          tmp = left;
          left = right;
          right = tmp ^ (spfunction2[right1 >>> 24 & 63] | spfunction4[right1 >>> 16 & 63] | spfunction6[right1 >>> 8 & 63] | spfunction8[right1 & 63] | spfunction1[right2 >>> 24 & 63] | spfunction3[right2 >>> 16 & 63] | spfunction5[right2 >>> 8 & 63] | spfunction7[right2 & 63]);
        }
        tmp = left;
        left = right;
        right = tmp;
      }
      left = left >>> 1 | left << 31;
      right = right >>> 1 | right << 31;
      tmp = (left >>> 1 ^ right) & 1431655765;
      right ^= tmp;
      left ^= tmp << 1;
      tmp = (right >>> 8 ^ left) & 16711935;
      left ^= tmp;
      right ^= tmp << 8;
      tmp = (right >>> 2 ^ left) & 858993459;
      left ^= tmp;
      right ^= tmp << 2;
      tmp = (left >>> 16 ^ right) & 65535;
      right ^= tmp;
      left ^= tmp << 16;
      tmp = (left >>> 4 ^ right) & 252645135;
      right ^= tmp;
      left ^= tmp << 4;
      output[0] = left;
      output[1] = right;
    }
    function _createCipher(options) {
      options = options || {};
      var mode = (options.mode || "CBC").toUpperCase();
      var algorithm = "DES-" + mode;
      var cipher;
      if (options.decrypt) {
        cipher = forge.cipher.createDecipher(algorithm, options.key);
      } else {
        cipher = forge.cipher.createCipher(algorithm, options.key);
      }
      var start = cipher.start;
      cipher.start = function(iv, options2) {
        var output = null;
        if (options2 instanceof forge.util.ByteBuffer) {
          output = options2;
          options2 = {};
        }
        options2 = options2 || {};
        options2.output = output;
        options2.iv = iv;
        start.call(cipher, options2);
      };
      return cipher;
    }
  }
});

// node_modules/node-forge/lib/md.js
var require_md = __commonJS({
  "node_modules/node-forge/lib/md.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    module2.exports = forge.md = forge.md || {};
    forge.md.algorithms = forge.md.algorithms || {};
  }
});

// node_modules/node-forge/lib/hmac.js
var require_hmac = __commonJS({
  "node_modules/node-forge/lib/hmac.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_md();
    require_util();
    var hmac = module2.exports = forge.hmac = forge.hmac || {};
    hmac.create = function() {
      var _key = null;
      var _md = null;
      var _ipadding = null;
      var _opadding = null;
      var ctx = {};
      ctx.start = function(md, key) {
        if (md !== null) {
          if (typeof md === "string") {
            md = md.toLowerCase();
            if (md in forge.md.algorithms) {
              _md = forge.md.algorithms[md].create();
            } else {
              throw new Error('Unknown hash algorithm "' + md + '"');
            }
          } else {
            _md = md;
          }
        }
        if (key === null) {
          key = _key;
        } else {
          if (typeof key === "string") {
            key = forge.util.createBuffer(key);
          } else if (forge.util.isArray(key)) {
            var tmp = key;
            key = forge.util.createBuffer();
            for (var i = 0; i < tmp.length; ++i) {
              key.putByte(tmp[i]);
            }
          }
          var keylen = key.length();
          if (keylen > _md.blockLength) {
            _md.start();
            _md.update(key.bytes());
            key = _md.digest();
          }
          _ipadding = forge.util.createBuffer();
          _opadding = forge.util.createBuffer();
          keylen = key.length();
          for (var i = 0; i < keylen; ++i) {
            var tmp = key.at(i);
            _ipadding.putByte(54 ^ tmp);
            _opadding.putByte(92 ^ tmp);
          }
          if (keylen < _md.blockLength) {
            var tmp = _md.blockLength - keylen;
            for (var i = 0; i < tmp; ++i) {
              _ipadding.putByte(54);
              _opadding.putByte(92);
            }
          }
          _key = key;
          _ipadding = _ipadding.bytes();
          _opadding = _opadding.bytes();
        }
        _md.start();
        _md.update(_ipadding);
      };
      ctx.update = function(bytes) {
        _md.update(bytes);
      };
      ctx.getMac = function() {
        var inner = _md.digest().bytes();
        _md.start();
        _md.update(_opadding);
        _md.update(inner);
        return _md.digest();
      };
      ctx.digest = ctx.getMac;
      return ctx;
    };
  }
});

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
    init_esbuild_shims();
  }
});

// node_modules/node-forge/lib/pbkdf2.js
var require_pbkdf2 = __commonJS({
  "node_modules/node-forge/lib/pbkdf2.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_hmac();
    require_md();
    require_util();
    var pkcs5 = forge.pkcs5 = forge.pkcs5 || {};
    var crypto3;
    if (forge.util.isNodejs && !forge.options.usePureJavaScript) {
      crypto3 = require_crypto();
    }
    module2.exports = forge.pbkdf2 = pkcs5.pbkdf2 = function(p2, s, c, dkLen, md, callback) {
      if (typeof md === "function") {
        callback = md;
        md = null;
      }
      if (forge.util.isNodejs && !forge.options.usePureJavaScript && crypto3.pbkdf2 && (md === null || typeof md !== "object") && (crypto3.pbkdf2Sync.length > 4 || (!md || md === "sha1"))) {
        if (typeof md !== "string") {
          md = "sha1";
        }
        p2 = Buffer.from(p2, "binary");
        s = Buffer.from(s, "binary");
        if (!callback) {
          if (crypto3.pbkdf2Sync.length === 4) {
            return crypto3.pbkdf2Sync(p2, s, c, dkLen).toString("binary");
          }
          return crypto3.pbkdf2Sync(p2, s, c, dkLen, md).toString("binary");
        }
        if (crypto3.pbkdf2Sync.length === 4) {
          return crypto3.pbkdf2(p2, s, c, dkLen, function(err2, key) {
            if (err2) {
              return callback(err2);
            }
            callback(null, key.toString("binary"));
          });
        }
        return crypto3.pbkdf2(p2, s, c, dkLen, md, function(err2, key) {
          if (err2) {
            return callback(err2);
          }
          callback(null, key.toString("binary"));
        });
      }
      if (typeof md === "undefined" || md === null) {
        md = "sha1";
      }
      if (typeof md === "string") {
        if (!(md in forge.md.algorithms)) {
          throw new Error("Unknown hash algorithm: " + md);
        }
        md = forge.md[md].create();
      }
      var hLen = md.digestLength;
      if (dkLen > 4294967295 * hLen) {
        var err = new Error("Derived key is too long.");
        if (callback) {
          return callback(err);
        }
        throw err;
      }
      var len = Math.ceil(dkLen / hLen);
      var r = dkLen - (len - 1) * hLen;
      var prf = forge.hmac.create();
      prf.start(md, p2);
      var dk = "";
      var xor, u_c, u_c1;
      if (!callback) {
        for (var i = 1; i <= len; ++i) {
          prf.start(null, null);
          prf.update(s);
          prf.update(forge.util.int32ToBytes(i));
          xor = u_c1 = prf.digest().getBytes();
          for (var j = 2; j <= c; ++j) {
            prf.start(null, null);
            prf.update(u_c1);
            u_c = prf.digest().getBytes();
            xor = forge.util.xorBytes(xor, u_c, hLen);
            u_c1 = u_c;
          }
          dk += i < len ? xor : xor.substr(0, r);
        }
        return dk;
      }
      var i = 1, j;
      function outer() {
        if (i > len) {
          return callback(null, dk);
        }
        prf.start(null, null);
        prf.update(s);
        prf.update(forge.util.int32ToBytes(i));
        xor = u_c1 = prf.digest().getBytes();
        j = 2;
        inner();
      }
      function inner() {
        if (j <= c) {
          prf.start(null, null);
          prf.update(u_c1);
          u_c = prf.digest().getBytes();
          xor = forge.util.xorBytes(xor, u_c, hLen);
          u_c1 = u_c;
          ++j;
          return forge.util.setImmediate(inner);
        }
        dk += i < len ? xor : xor.substr(0, r);
        ++i;
        outer();
      }
      outer();
    };
  }
});

// node_modules/node-forge/lib/pem.js
var require_pem = __commonJS({
  "node_modules/node-forge/lib/pem.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    var pem = module2.exports = forge.pem = forge.pem || {};
    pem.encode = function(msg, options) {
      options = options || {};
      var rval = "-----BEGIN " + msg.type + "-----\r\n";
      var header;
      if (msg.procType) {
        header = {
          name: "Proc-Type",
          values: [String(msg.procType.version), msg.procType.type]
        };
        rval += foldHeader(header);
      }
      if (msg.contentDomain) {
        header = { name: "Content-Domain", values: [msg.contentDomain] };
        rval += foldHeader(header);
      }
      if (msg.dekInfo) {
        header = { name: "DEK-Info", values: [msg.dekInfo.algorithm] };
        if (msg.dekInfo.parameters) {
          header.values.push(msg.dekInfo.parameters);
        }
        rval += foldHeader(header);
      }
      if (msg.headers) {
        for (var i = 0; i < msg.headers.length; ++i) {
          rval += foldHeader(msg.headers[i]);
        }
      }
      if (msg.procType) {
        rval += "\r\n";
      }
      rval += forge.util.encode64(msg.body, options.maxline || 64) + "\r\n";
      rval += "-----END " + msg.type + "-----\r\n";
      return rval;
    };
    pem.decode = function(str) {
      var rval = [];
      var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
      var rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/;
      var rCRLF = /\r?\n/;
      var match;
      while (true) {
        match = rMessage.exec(str);
        if (!match) {
          break;
        }
        var type = match[1];
        if (type === "NEW CERTIFICATE REQUEST") {
          type = "CERTIFICATE REQUEST";
        }
        var msg = {
          type,
          procType: null,
          contentDomain: null,
          dekInfo: null,
          headers: [],
          body: forge.util.decode64(match[3])
        };
        rval.push(msg);
        if (!match[2]) {
          continue;
        }
        var lines = match[2].split(rCRLF);
        var li = 0;
        while (match && li < lines.length) {
          var line = lines[li].replace(/\s+$/, "");
          for (var nl = li + 1; nl < lines.length; ++nl) {
            var next = lines[nl];
            if (!/\s/.test(next[0])) {
              break;
            }
            line += next;
            li = nl;
          }
          match = line.match(rHeader);
          if (match) {
            var header = { name: match[1], values: [] };
            var values = match[2].split(",");
            for (var vi = 0; vi < values.length; ++vi) {
              header.values.push(ltrim(values[vi]));
            }
            if (!msg.procType) {
              if (header.name !== "Proc-Type") {
                throw new Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".');
              } else if (header.values.length !== 2) {
                throw new Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.');
              }
              msg.procType = { version: values[0], type: values[1] };
            } else if (!msg.contentDomain && header.name === "Content-Domain") {
              msg.contentDomain = values[0] || "";
            } else if (!msg.dekInfo && header.name === "DEK-Info") {
              if (header.values.length === 0) {
                throw new Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.');
              }
              msg.dekInfo = { algorithm: values[0], parameters: values[1] || null };
            } else {
              msg.headers.push(header);
            }
          }
          ++li;
        }
        if (msg.procType === "ENCRYPTED" && !msg.dekInfo) {
          throw new Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".');
        }
      }
      if (rval.length === 0) {
        throw new Error("Invalid PEM formatted message.");
      }
      return rval;
    };
    function foldHeader(header) {
      var rval = header.name + ": ";
      var values = [];
      var insertSpace = function(match, $1) {
        return " " + $1;
      };
      for (var i = 0; i < header.values.length; ++i) {
        values.push(header.values[i].replace(/^(\S+\r\n)/, insertSpace));
      }
      rval += values.join(",") + "\r\n";
      var length2 = 0;
      var candidate = -1;
      for (var i = 0; i < rval.length; ++i, ++length2) {
        if (length2 > 65 && candidate !== -1) {
          var insert = rval[candidate];
          if (insert === ",") {
            ++candidate;
            rval = rval.substr(0, candidate) + "\r\n " + rval.substr(candidate);
          } else {
            rval = rval.substr(0, candidate) + "\r\n" + insert + rval.substr(candidate + 1);
          }
          length2 = i - candidate - 1;
          candidate = -1;
          ++i;
        } else if (rval[i] === " " || rval[i] === "	" || rval[i] === ",") {
          candidate = i;
        }
      }
      return rval;
    }
    function ltrim(str) {
      return str.replace(/^\s+/, "");
    }
  }
});

// node_modules/node-forge/lib/sha256.js
var require_sha256 = __commonJS({
  "node_modules/node-forge/lib/sha256.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_md();
    require_util();
    var sha2562 = module2.exports = forge.sha256 = forge.sha256 || {};
    forge.md.sha256 = forge.md.algorithms.sha256 = sha2562;
    sha2562.create = function() {
      if (!_initialized) {
        _init();
      }
      var _state = null;
      var _input = forge.util.createBuffer();
      var _w = new Array(64);
      var md = {
        algorithm: "sha256",
        blockLength: 64,
        digestLength: 32,
        // 56-bit length of message so far (does not including padding)
        messageLength: 0,
        // true message length
        fullMessageLength: null,
        // size of message length in bytes
        messageLengthSize: 8
      };
      md.start = function() {
        md.messageLength = 0;
        md.fullMessageLength = md.messageLength64 = [];
        var int32s = md.messageLengthSize / 4;
        for (var i = 0; i < int32s; ++i) {
          md.fullMessageLength.push(0);
        }
        _input = forge.util.createBuffer();
        _state = {
          h0: 1779033703,
          h1: 3144134277,
          h2: 1013904242,
          h3: 2773480762,
          h4: 1359893119,
          h5: 2600822924,
          h6: 528734635,
          h7: 1541459225
        };
        return md;
      };
      md.start();
      md.update = function(msg, encoding) {
        if (encoding === "utf8") {
          msg = forge.util.encodeUtf8(msg);
        }
        var len = msg.length;
        md.messageLength += len;
        len = [len / 4294967296 >>> 0, len >>> 0];
        for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
          md.fullMessageLength[i] += len[1];
          len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
          md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
          len[0] = len[1] / 4294967296 >>> 0;
        }
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
          _input.compact();
        }
        return md;
      };
      md.digest = function() {
        var finalBlock = forge.util.createBuffer();
        finalBlock.putBytes(_input.bytes());
        var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
        var overflow = remaining & md.blockLength - 1;
        finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
        var next, carry;
        var bits = md.fullMessageLength[0] * 8;
        for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
          next = md.fullMessageLength[i + 1] * 8;
          carry = next / 4294967296 >>> 0;
          bits += carry;
          finalBlock.putInt32(bits >>> 0);
          bits = next >>> 0;
        }
        finalBlock.putInt32(bits);
        var s2 = {
          h0: _state.h0,
          h1: _state.h1,
          h2: _state.h2,
          h3: _state.h3,
          h4: _state.h4,
          h5: _state.h5,
          h6: _state.h6,
          h7: _state.h7
        };
        _update(s2, _w, finalBlock);
        var rval = forge.util.createBuffer();
        rval.putInt32(s2.h0);
        rval.putInt32(s2.h1);
        rval.putInt32(s2.h2);
        rval.putInt32(s2.h3);
        rval.putInt32(s2.h4);
        rval.putInt32(s2.h5);
        rval.putInt32(s2.h6);
        rval.putInt32(s2.h7);
        return rval;
      };
      return md;
    };
    var _padding = null;
    var _initialized = false;
    var _k = null;
    function _init() {
      _padding = String.fromCharCode(128);
      _padding += forge.util.fillString(String.fromCharCode(0), 64);
      _k = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ];
      _initialized = true;
    }
    function _update(s, w2, bytes) {
      var t1, t2, s0, s1, ch, maj, i, a, b2, c, d2, e2, f2, g2, h2;
      var len = bytes.length();
      while (len >= 64) {
        for (i = 0; i < 16; ++i) {
          w2[i] = bytes.getInt32();
        }
        for (; i < 64; ++i) {
          t1 = w2[i - 2];
          t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
          t2 = w2[i - 15];
          t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3;
          w2[i] = t1 + w2[i - 7] + t2 + w2[i - 16] | 0;
        }
        a = s.h0;
        b2 = s.h1;
        c = s.h2;
        d2 = s.h3;
        e2 = s.h4;
        f2 = s.h5;
        g2 = s.h6;
        h2 = s.h7;
        for (i = 0; i < 64; ++i) {
          s1 = (e2 >>> 6 | e2 << 26) ^ (e2 >>> 11 | e2 << 21) ^ (e2 >>> 25 | e2 << 7);
          ch = g2 ^ e2 & (f2 ^ g2);
          s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
          maj = a & b2 | c & (a ^ b2);
          t1 = h2 + s1 + ch + _k[i] + w2[i];
          t2 = s0 + maj;
          h2 = g2;
          g2 = f2;
          f2 = e2;
          e2 = d2 + t1 >>> 0;
          d2 = c;
          c = b2;
          b2 = a;
          a = t1 + t2 >>> 0;
        }
        s.h0 = s.h0 + a | 0;
        s.h1 = s.h1 + b2 | 0;
        s.h2 = s.h2 + c | 0;
        s.h3 = s.h3 + d2 | 0;
        s.h4 = s.h4 + e2 | 0;
        s.h5 = s.h5 + f2 | 0;
        s.h6 = s.h6 + g2 | 0;
        s.h7 = s.h7 + h2 | 0;
        len -= 64;
      }
    }
  }
});

// node_modules/node-forge/lib/prng.js
var require_prng = __commonJS({
  "node_modules/node-forge/lib/prng.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    var _crypto = null;
    if (forge.util.isNodejs && !forge.options.usePureJavaScript && !process.versions["node-webkit"]) {
      _crypto = require_crypto();
    }
    var prng = module2.exports = forge.prng = forge.prng || {};
    prng.create = function(plugin) {
      var ctx = {
        plugin,
        key: null,
        seed: null,
        time: null,
        // number of reseeds so far
        reseeds: 0,
        // amount of data generated so far
        generated: 0,
        // no initial key bytes
        keyBytes: ""
      };
      var md = plugin.md;
      var pools = new Array(32);
      for (var i = 0; i < 32; ++i) {
        pools[i] = md.create();
      }
      ctx.pools = pools;
      ctx.pool = 0;
      ctx.generate = function(count, callback) {
        if (!callback) {
          return ctx.generateSync(count);
        }
        var cipher = ctx.plugin.cipher;
        var increment = ctx.plugin.increment;
        var formatKey = ctx.plugin.formatKey;
        var formatSeed = ctx.plugin.formatSeed;
        var b2 = forge.util.createBuffer();
        ctx.key = null;
        generate();
        function generate(err) {
          if (err) {
            return callback(err);
          }
          if (b2.length() >= count) {
            return callback(null, b2.getBytes(count));
          }
          if (ctx.generated > 1048575) {
            ctx.key = null;
          }
          if (ctx.key === null) {
            return forge.util.nextTick(function() {
              _reseed(generate);
            });
          }
          var bytes = cipher(ctx.key, ctx.seed);
          ctx.generated += bytes.length;
          b2.putBytes(bytes);
          ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
          ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
          forge.util.setImmediate(generate);
        }
      };
      ctx.generateSync = function(count) {
        var cipher = ctx.plugin.cipher;
        var increment = ctx.plugin.increment;
        var formatKey = ctx.plugin.formatKey;
        var formatSeed = ctx.plugin.formatSeed;
        ctx.key = null;
        var b2 = forge.util.createBuffer();
        while (b2.length() < count) {
          if (ctx.generated > 1048575) {
            ctx.key = null;
          }
          if (ctx.key === null) {
            _reseedSync();
          }
          var bytes = cipher(ctx.key, ctx.seed);
          ctx.generated += bytes.length;
          b2.putBytes(bytes);
          ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
          ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
        }
        return b2.getBytes(count);
      };
      function _reseed(callback) {
        if (ctx.pools[0].messageLength >= 32) {
          _seed();
          return callback();
        }
        var needed = 32 - ctx.pools[0].messageLength << 5;
        ctx.seedFile(needed, function(err, bytes) {
          if (err) {
            return callback(err);
          }
          ctx.collect(bytes);
          _seed();
          callback();
        });
      }
      function _reseedSync() {
        if (ctx.pools[0].messageLength >= 32) {
          return _seed();
        }
        var needed = 32 - ctx.pools[0].messageLength << 5;
        ctx.collect(ctx.seedFileSync(needed));
        _seed();
      }
      function _seed() {
        ctx.reseeds = ctx.reseeds === 4294967295 ? 0 : ctx.reseeds + 1;
        var md2 = ctx.plugin.md.create();
        md2.update(ctx.keyBytes);
        var _2powK = 1;
        for (var k = 0; k < 32; ++k) {
          if (ctx.reseeds % _2powK === 0) {
            md2.update(ctx.pools[k].digest().getBytes());
            ctx.pools[k].start();
          }
          _2powK = _2powK << 1;
        }
        ctx.keyBytes = md2.digest().getBytes();
        md2.start();
        md2.update(ctx.keyBytes);
        var seedBytes = md2.digest().getBytes();
        ctx.key = ctx.plugin.formatKey(ctx.keyBytes);
        ctx.seed = ctx.plugin.formatSeed(seedBytes);
        ctx.generated = 0;
      }
      function defaultSeedFile(needed) {
        var getRandomValues = null;
        var globalScope = forge.util.globalScope;
        var _crypto2 = globalScope.crypto || globalScope.msCrypto;
        if (_crypto2 && _crypto2.getRandomValues) {
          getRandomValues = function(arr) {
            return _crypto2.getRandomValues(arr);
          };
        }
        var b2 = forge.util.createBuffer();
        if (getRandomValues) {
          while (b2.length() < needed) {
            var count = Math.max(1, Math.min(needed - b2.length(), 65536) / 4);
            var entropy = new Uint32Array(Math.floor(count));
            try {
              getRandomValues(entropy);
              for (var i2 = 0; i2 < entropy.length; ++i2) {
                b2.putInt32(entropy[i2]);
              }
            } catch (e2) {
              if (!(typeof QuotaExceededError !== "undefined" && e2 instanceof QuotaExceededError)) {
                throw e2;
              }
            }
          }
        }
        if (b2.length() < needed) {
          var hi, lo, next;
          var seed = Math.floor(Math.random() * 65536);
          while (b2.length() < needed) {
            lo = 16807 * (seed & 65535);
            hi = 16807 * (seed >> 16);
            lo += (hi & 32767) << 16;
            lo += hi >> 15;
            lo = (lo & 2147483647) + (lo >> 31);
            seed = lo & 4294967295;
            for (var i2 = 0; i2 < 3; ++i2) {
              next = seed >>> (i2 << 3);
              next ^= Math.floor(Math.random() * 256);
              b2.putByte(next & 255);
            }
          }
        }
        return b2.getBytes(needed);
      }
      if (_crypto) {
        ctx.seedFile = function(needed, callback) {
          _crypto.randomBytes(needed, function(err, bytes) {
            if (err) {
              return callback(err);
            }
            callback(null, bytes.toString());
          });
        };
        ctx.seedFileSync = function(needed) {
          return _crypto.randomBytes(needed).toString();
        };
      } else {
        ctx.seedFile = function(needed, callback) {
          try {
            callback(null, defaultSeedFile(needed));
          } catch (e2) {
            callback(e2);
          }
        };
        ctx.seedFileSync = defaultSeedFile;
      }
      ctx.collect = function(bytes) {
        var count = bytes.length;
        for (var i2 = 0; i2 < count; ++i2) {
          ctx.pools[ctx.pool].update(bytes.substr(i2, 1));
          ctx.pool = ctx.pool === 31 ? 0 : ctx.pool + 1;
        }
      };
      ctx.collectInt = function(i2, n2) {
        var bytes = "";
        for (var x = 0; x < n2; x += 8) {
          bytes += String.fromCharCode(i2 >> x & 255);
        }
        ctx.collect(bytes);
      };
      ctx.registerWorker = function(worker) {
        if (worker === self) {
          ctx.seedFile = function(needed, callback) {
            function listener2(e2) {
              var data = e2.data;
              if (data.forge && data.forge.prng) {
                self.removeEventListener("message", listener2);
                callback(data.forge.prng.err, data.forge.prng.bytes);
              }
            }
            self.addEventListener("message", listener2);
            self.postMessage({ forge: { prng: { needed } } });
          };
        } else {
          var listener = function(e2) {
            var data = e2.data;
            if (data.forge && data.forge.prng) {
              ctx.seedFile(data.forge.prng.needed, function(err, bytes) {
                worker.postMessage({ forge: { prng: { err, bytes } } });
              });
            }
          };
          worker.addEventListener("message", listener);
        }
      };
      return ctx;
    };
  }
});

// node_modules/node-forge/lib/random.js
var require_random = __commonJS({
  "node_modules/node-forge/lib/random.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_aes();
    require_sha256();
    require_prng();
    require_util();
    (function() {
      if (forge.random && forge.random.getBytes) {
        module2.exports = forge.random;
        return;
      }
      (function(jQuery2) {
        var prng_aes = {};
        var _prng_aes_output = new Array(4);
        var _prng_aes_buffer = forge.util.createBuffer();
        prng_aes.formatKey = function(key2) {
          var tmp = forge.util.createBuffer(key2);
          key2 = new Array(4);
          key2[0] = tmp.getInt32();
          key2[1] = tmp.getInt32();
          key2[2] = tmp.getInt32();
          key2[3] = tmp.getInt32();
          return forge.aes._expandKey(key2, false);
        };
        prng_aes.formatSeed = function(seed) {
          var tmp = forge.util.createBuffer(seed);
          seed = new Array(4);
          seed[0] = tmp.getInt32();
          seed[1] = tmp.getInt32();
          seed[2] = tmp.getInt32();
          seed[3] = tmp.getInt32();
          return seed;
        };
        prng_aes.cipher = function(key2, seed) {
          forge.aes._updateBlock(key2, seed, _prng_aes_output, false);
          _prng_aes_buffer.putInt32(_prng_aes_output[0]);
          _prng_aes_buffer.putInt32(_prng_aes_output[1]);
          _prng_aes_buffer.putInt32(_prng_aes_output[2]);
          _prng_aes_buffer.putInt32(_prng_aes_output[3]);
          return _prng_aes_buffer.getBytes();
        };
        prng_aes.increment = function(seed) {
          ++seed[3];
          return seed;
        };
        prng_aes.md = forge.md.sha256;
        function spawnPrng() {
          var ctx = forge.prng.create(prng_aes);
          ctx.getBytes = function(count, callback) {
            return ctx.generate(count, callback);
          };
          ctx.getBytesSync = function(count) {
            return ctx.generate(count);
          };
          return ctx;
        }
        var _ctx = spawnPrng();
        var getRandomValues = null;
        var globalScope = forge.util.globalScope;
        var _crypto = globalScope.crypto || globalScope.msCrypto;
        if (_crypto && _crypto.getRandomValues) {
          getRandomValues = function(arr) {
            return _crypto.getRandomValues(arr);
          };
        }
        if (forge.options.usePureJavaScript || !forge.util.isNodejs && !getRandomValues) {
          if (typeof window === "undefined" || window.document === void 0) {
          }
          _ctx.collectInt(+/* @__PURE__ */ new Date(), 32);
          if (typeof navigator !== "undefined") {
            var _navBytes = "";
            for (var key in navigator) {
              try {
                if (typeof navigator[key] == "string") {
                  _navBytes += navigator[key];
                }
              } catch (e2) {
              }
            }
            _ctx.collect(_navBytes);
            _navBytes = null;
          }
          if (jQuery2) {
            jQuery2().mousemove(function(e2) {
              _ctx.collectInt(e2.clientX, 16);
              _ctx.collectInt(e2.clientY, 16);
            });
            jQuery2().keypress(function(e2) {
              _ctx.collectInt(e2.charCode, 8);
            });
          }
        }
        if (!forge.random) {
          forge.random = _ctx;
        } else {
          for (var key in _ctx) {
            forge.random[key] = _ctx[key];
          }
        }
        forge.random.createInstance = spawnPrng;
        module2.exports = forge.random;
      })(typeof jQuery !== "undefined" ? jQuery : null);
    })();
  }
});

// node_modules/node-forge/lib/rc2.js
var require_rc2 = __commonJS({
  "node_modules/node-forge/lib/rc2.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    var piTable = [
      217,
      120,
      249,
      196,
      25,
      221,
      181,
      237,
      40,
      233,
      253,
      121,
      74,
      160,
      216,
      157,
      198,
      126,
      55,
      131,
      43,
      118,
      83,
      142,
      98,
      76,
      100,
      136,
      68,
      139,
      251,
      162,
      23,
      154,
      89,
      245,
      135,
      179,
      79,
      19,
      97,
      69,
      109,
      141,
      9,
      129,
      125,
      50,
      189,
      143,
      64,
      235,
      134,
      183,
      123,
      11,
      240,
      149,
      33,
      34,
      92,
      107,
      78,
      130,
      84,
      214,
      101,
      147,
      206,
      96,
      178,
      28,
      115,
      86,
      192,
      20,
      167,
      140,
      241,
      220,
      18,
      117,
      202,
      31,
      59,
      190,
      228,
      209,
      66,
      61,
      212,
      48,
      163,
      60,
      182,
      38,
      111,
      191,
      14,
      218,
      70,
      105,
      7,
      87,
      39,
      242,
      29,
      155,
      188,
      148,
      67,
      3,
      248,
      17,
      199,
      246,
      144,
      239,
      62,
      231,
      6,
      195,
      213,
      47,
      200,
      102,
      30,
      215,
      8,
      232,
      234,
      222,
      128,
      82,
      238,
      247,
      132,
      170,
      114,
      172,
      53,
      77,
      106,
      42,
      150,
      26,
      210,
      113,
      90,
      21,
      73,
      116,
      75,
      159,
      208,
      94,
      4,
      24,
      164,
      236,
      194,
      224,
      65,
      110,
      15,
      81,
      203,
      204,
      36,
      145,
      175,
      80,
      161,
      244,
      112,
      57,
      153,
      124,
      58,
      133,
      35,
      184,
      180,
      122,
      252,
      2,
      54,
      91,
      37,
      85,
      151,
      49,
      45,
      93,
      250,
      152,
      227,
      138,
      146,
      174,
      5,
      223,
      41,
      16,
      103,
      108,
      186,
      201,
      211,
      0,
      230,
      207,
      225,
      158,
      168,
      44,
      99,
      22,
      1,
      63,
      88,
      226,
      137,
      169,
      13,
      56,
      52,
      27,
      171,
      51,
      255,
      176,
      187,
      72,
      12,
      95,
      185,
      177,
      205,
      46,
      197,
      243,
      219,
      71,
      229,
      165,
      156,
      119,
      10,
      166,
      32,
      104,
      254,
      127,
      193,
      173
    ];
    var s = [1, 2, 3, 5];
    var rol = function(word, bits) {
      return word << bits & 65535 | (word & 65535) >> 16 - bits;
    };
    var ror = function(word, bits) {
      return (word & 65535) >> bits | word << 16 - bits & 65535;
    };
    module2.exports = forge.rc2 = forge.rc2 || {};
    forge.rc2.expandKey = function(key, effKeyBits) {
      if (typeof key === "string") {
        key = forge.util.createBuffer(key);
      }
      effKeyBits = effKeyBits || 128;
      var L = key;
      var T = key.length();
      var T1 = effKeyBits;
      var T8 = Math.ceil(T1 / 8);
      var TM = 255 >> (T1 & 7);
      var i;
      for (i = T; i < 128; i++) {
        L.putByte(piTable[L.at(i - 1) + L.at(i - T) & 255]);
      }
      L.setAt(128 - T8, piTable[L.at(128 - T8) & TM]);
      for (i = 127 - T8; i >= 0; i--) {
        L.setAt(i, piTable[L.at(i + 1) ^ L.at(i + T8)]);
      }
      return L;
    };
    var createCipher = function(key, bits, encrypt) {
      var _finish = false, _input = null, _output = null, _iv = null;
      var mixRound, mashRound;
      var i, j, K = [];
      key = forge.rc2.expandKey(key, bits);
      for (i = 0; i < 64; i++) {
        K.push(key.getInt16Le());
      }
      if (encrypt) {
        mixRound = function(R) {
          for (i = 0; i < 4; i++) {
            R[i] += K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
            R[i] = rol(R[i], s[i]);
            j++;
          }
        };
        mashRound = function(R) {
          for (i = 0; i < 4; i++) {
            R[i] += K[R[(i + 3) % 4] & 63];
          }
        };
      } else {
        mixRound = function(R) {
          for (i = 3; i >= 0; i--) {
            R[i] = ror(R[i], s[i]);
            R[i] -= K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
            j--;
          }
        };
        mashRound = function(R) {
          for (i = 3; i >= 0; i--) {
            R[i] -= K[R[(i + 3) % 4] & 63];
          }
        };
      }
      var runPlan = function(plan) {
        var R = [];
        for (i = 0; i < 4; i++) {
          var val = _input.getInt16Le();
          if (_iv !== null) {
            if (encrypt) {
              val ^= _iv.getInt16Le();
            } else {
              _iv.putInt16Le(val);
            }
          }
          R.push(val & 65535);
        }
        j = encrypt ? 0 : 63;
        for (var ptr = 0; ptr < plan.length; ptr++) {
          for (var ctr = 0; ctr < plan[ptr][0]; ctr++) {
            plan[ptr][1](R);
          }
        }
        for (i = 0; i < 4; i++) {
          if (_iv !== null) {
            if (encrypt) {
              _iv.putInt16Le(R[i]);
            } else {
              R[i] ^= _iv.getInt16Le();
            }
          }
          _output.putInt16Le(R[i]);
        }
      };
      var cipher = null;
      cipher = {
        /**
         * Starts or restarts the encryption or decryption process, whichever
         * was previously configured.
         *
         * To use the cipher in CBC mode, iv may be given either as a string
         * of bytes, or as a byte buffer.  For ECB mode, give null as iv.
         *
         * @param iv the initialization vector to use, null for ECB mode.
         * @param output the output the buffer to write to, null to create one.
         */
        start: function(iv, output) {
          if (iv) {
            if (typeof iv === "string") {
              iv = forge.util.createBuffer(iv);
            }
          }
          _finish = false;
          _input = forge.util.createBuffer();
          _output = output || new forge.util.createBuffer();
          _iv = iv;
          cipher.output = _output;
        },
        /**
         * Updates the next block.
         *
         * @param input the buffer to read from.
         */
        update: function(input) {
          if (!_finish) {
            _input.putBuffer(input);
          }
          while (_input.length() >= 8) {
            runPlan([
              [5, mixRound],
              [1, mashRound],
              [6, mixRound],
              [1, mashRound],
              [5, mixRound]
            ]);
          }
        },
        /**
         * Finishes encrypting or decrypting.
         *
         * @param pad a padding function to use, null for PKCS#7 padding,
         *           signature(blockSize, buffer, decrypt).
         *
         * @return true if successful, false on error.
         */
        finish: function(pad) {
          var rval = true;
          if (encrypt) {
            if (pad) {
              rval = pad(8, _input, !encrypt);
            } else {
              var padding = _input.length() === 8 ? 8 : 8 - _input.length();
              _input.fillWithByte(padding, padding);
            }
          }
          if (rval) {
            _finish = true;
            cipher.update();
          }
          if (!encrypt) {
            rval = _input.length() === 0;
            if (rval) {
              if (pad) {
                rval = pad(8, _output, !encrypt);
              } else {
                var len = _output.length();
                var count = _output.at(len - 1);
                if (count > len) {
                  rval = false;
                } else {
                  _output.truncate(count);
                }
              }
            }
          }
          return rval;
        }
      };
      return cipher;
    };
    forge.rc2.startEncrypting = function(key, iv, output) {
      var cipher = forge.rc2.createEncryptionCipher(key, 128);
      cipher.start(iv, output);
      return cipher;
    };
    forge.rc2.createEncryptionCipher = function(key, bits) {
      return createCipher(key, bits, true);
    };
    forge.rc2.startDecrypting = function(key, iv, output) {
      var cipher = forge.rc2.createDecryptionCipher(key, 128);
      cipher.start(iv, output);
      return cipher;
    };
    forge.rc2.createDecryptionCipher = function(key, bits) {
      return createCipher(key, bits, false);
    };
  }
});

// node_modules/node-forge/lib/jsbn.js
var require_jsbn = __commonJS({
  "node_modules/node-forge/lib/jsbn.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    module2.exports = forge.jsbn = forge.jsbn || {};
    var dbits;
    var canary = 244837814094590;
    var j_lm = (canary & 16777215) == 15715070;
    function BigInteger(a, b2, c) {
      this.data = [];
      if (a != null)
        if ("number" == typeof a) this.fromNumber(a, b2, c);
        else if (b2 == null && "string" != typeof a) this.fromString(a, 256);
        else this.fromString(a, b2);
    }
    forge.jsbn.BigInteger = BigInteger;
    function nbi() {
      return new BigInteger(null);
    }
    function am1(i, x, w2, j, c, n2) {
      while (--n2 >= 0) {
        var v2 = x * this.data[i++] + w2.data[j] + c;
        c = Math.floor(v2 / 67108864);
        w2.data[j++] = v2 & 67108863;
      }
      return c;
    }
    function am2(i, x, w2, j, c, n2) {
      var xl = x & 32767, xh = x >> 15;
      while (--n2 >= 0) {
        var l2 = this.data[i] & 32767;
        var h2 = this.data[i++] >> 15;
        var m = xh * l2 + h2 * xl;
        l2 = xl * l2 + ((m & 32767) << 15) + w2.data[j] + (c & 1073741823);
        c = (l2 >>> 30) + (m >>> 15) + xh * h2 + (c >>> 30);
        w2.data[j++] = l2 & 1073741823;
      }
      return c;
    }
    function am3(i, x, w2, j, c, n2) {
      var xl = x & 16383, xh = x >> 14;
      while (--n2 >= 0) {
        var l2 = this.data[i] & 16383;
        var h2 = this.data[i++] >> 14;
        var m = xh * l2 + h2 * xl;
        l2 = xl * l2 + ((m & 16383) << 14) + w2.data[j] + c;
        c = (l2 >> 28) + (m >> 14) + xh * h2;
        w2.data[j++] = l2 & 268435455;
      }
      return c;
    }
    if (typeof navigator === "undefined") {
      BigInteger.prototype.am = am3;
      dbits = 28;
    } else if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
      BigInteger.prototype.am = am2;
      dbits = 30;
    } else if (j_lm && navigator.appName != "Netscape") {
      BigInteger.prototype.am = am1;
      dbits = 26;
    } else {
      BigInteger.prototype.am = am3;
      dbits = 28;
    }
    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = (1 << dbits) - 1;
    BigInteger.prototype.DV = 1 << dbits;
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2, BI_FP);
    BigInteger.prototype.F1 = BI_FP - dbits;
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr;
    var vv;
    rr = "0".charCodeAt(0);
    for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    function int2char(n2) {
      return BI_RM.charAt(n2);
    }
    function intAt(s, i) {
      var c = BI_RC[s.charCodeAt(i)];
      return c == null ? -1 : c;
    }
    function bnpCopyTo(r) {
      for (var i = this.t - 1; i >= 0; --i) r.data[i] = this.data[i];
      r.t = this.t;
      r.s = this.s;
    }
    function bnpFromInt(x) {
      this.t = 1;
      this.s = x < 0 ? -1 : 0;
      if (x > 0) this.data[0] = x;
      else if (x < -1) this.data[0] = x + this.DV;
      else this.t = 0;
    }
    function nbv(i) {
      var r = nbi();
      r.fromInt(i);
      return r;
    }
    function bnpFromString(s, b2) {
      var k;
      if (b2 == 16) k = 4;
      else if (b2 == 8) k = 3;
      else if (b2 == 256) k = 8;
      else if (b2 == 2) k = 1;
      else if (b2 == 32) k = 5;
      else if (b2 == 4) k = 2;
      else {
        this.fromRadix(s, b2);
        return;
      }
      this.t = 0;
      this.s = 0;
      var i = s.length, mi = false, sh = 0;
      while (--i >= 0) {
        var x = k == 8 ? s[i] & 255 : intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-") mi = true;
          continue;
        }
        mi = false;
        if (sh == 0)
          this.data[this.t++] = x;
        else if (sh + k > this.DB) {
          this.data[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
          this.data[this.t++] = x >> this.DB - sh;
        } else
          this.data[this.t - 1] |= x << sh;
        sh += k;
        if (sh >= this.DB) sh -= this.DB;
      }
      if (k == 8 && (s[0] & 128) != 0) {
        this.s = -1;
        if (sh > 0) this.data[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
      }
      this.clamp();
      if (mi) BigInteger.ZERO.subTo(this, this);
    }
    function bnpClamp() {
      var c = this.s & this.DM;
      while (this.t > 0 && this.data[this.t - 1] == c) --this.t;
    }
    function bnToString(b2) {
      if (this.s < 0) return "-" + this.negate().toString(b2);
      var k;
      if (b2 == 16) k = 4;
      else if (b2 == 8) k = 3;
      else if (b2 == 2) k = 1;
      else if (b2 == 32) k = 5;
      else if (b2 == 4) k = 2;
      else return this.toRadix(b2);
      var km = (1 << k) - 1, d2, m = false, r = "", i = this.t;
      var p2 = this.DB - i * this.DB % k;
      if (i-- > 0) {
        if (p2 < this.DB && (d2 = this.data[i] >> p2) > 0) {
          m = true;
          r = int2char(d2);
        }
        while (i >= 0) {
          if (p2 < k) {
            d2 = (this.data[i] & (1 << p2) - 1) << k - p2;
            d2 |= this.data[--i] >> (p2 += this.DB - k);
          } else {
            d2 = this.data[i] >> (p2 -= k) & km;
            if (p2 <= 0) {
              p2 += this.DB;
              --i;
            }
          }
          if (d2 > 0) m = true;
          if (m) r += int2char(d2);
        }
      }
      return m ? r : "0";
    }
    function bnNegate() {
      var r = nbi();
      BigInteger.ZERO.subTo(this, r);
      return r;
    }
    function bnAbs() {
      return this.s < 0 ? this.negate() : this;
    }
    function bnCompareTo(a) {
      var r = this.s - a.s;
      if (r != 0) return r;
      var i = this.t;
      r = i - a.t;
      if (r != 0) return this.s < 0 ? -r : r;
      while (--i >= 0) if ((r = this.data[i] - a.data[i]) != 0) return r;
      return 0;
    }
    function nbits(x) {
      var r = 1, t2;
      if ((t2 = x >>> 16) != 0) {
        x = t2;
        r += 16;
      }
      if ((t2 = x >> 8) != 0) {
        x = t2;
        r += 8;
      }
      if ((t2 = x >> 4) != 0) {
        x = t2;
        r += 4;
      }
      if ((t2 = x >> 2) != 0) {
        x = t2;
        r += 2;
      }
      if ((t2 = x >> 1) != 0) {
        x = t2;
        r += 1;
      }
      return r;
    }
    function bnBitLength() {
      if (this.t <= 0) return 0;
      return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ this.s & this.DM);
    }
    function bnpDLShiftTo(n2, r) {
      var i;
      for (i = this.t - 1; i >= 0; --i) r.data[i + n2] = this.data[i];
      for (i = n2 - 1; i >= 0; --i) r.data[i] = 0;
      r.t = this.t + n2;
      r.s = this.s;
    }
    function bnpDRShiftTo(n2, r) {
      for (var i = n2; i < this.t; ++i) r.data[i - n2] = this.data[i];
      r.t = Math.max(this.t - n2, 0);
      r.s = this.s;
    }
    function bnpLShiftTo(n2, r) {
      var bs = n2 % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << cbs) - 1;
      var ds = Math.floor(n2 / this.DB), c = this.s << bs & this.DM, i;
      for (i = this.t - 1; i >= 0; --i) {
        r.data[i + ds + 1] = this.data[i] >> cbs | c;
        c = (this.data[i] & bm) << bs;
      }
      for (i = ds - 1; i >= 0; --i) r.data[i] = 0;
      r.data[ds] = c;
      r.t = this.t + ds + 1;
      r.s = this.s;
      r.clamp();
    }
    function bnpRShiftTo(n2, r) {
      r.s = this.s;
      var ds = Math.floor(n2 / this.DB);
      if (ds >= this.t) {
        r.t = 0;
        return;
      }
      var bs = n2 % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << bs) - 1;
      r.data[0] = this.data[ds] >> bs;
      for (var i = ds + 1; i < this.t; ++i) {
        r.data[i - ds - 1] |= (this.data[i] & bm) << cbs;
        r.data[i - ds] = this.data[i] >> bs;
      }
      if (bs > 0) r.data[this.t - ds - 1] |= (this.s & bm) << cbs;
      r.t = this.t - ds;
      r.clamp();
    }
    function bnpSubTo(a, r) {
      var i = 0, c = 0, m = Math.min(a.t, this.t);
      while (i < m) {
        c += this.data[i] - a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      if (a.t < this.t) {
        c -= a.s;
        while (i < this.t) {
          c += this.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += this.s;
      } else {
        c += this.s;
        while (i < a.t) {
          c -= a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c -= a.s;
      }
      r.s = c < 0 ? -1 : 0;
      if (c < -1) r.data[i++] = this.DV + c;
      else if (c > 0) r.data[i++] = c;
      r.t = i;
      r.clamp();
    }
    function bnpMultiplyTo(a, r) {
      var x = this.abs(), y2 = a.abs();
      var i = x.t;
      r.t = i + y2.t;
      while (--i >= 0) r.data[i] = 0;
      for (i = 0; i < y2.t; ++i) r.data[i + x.t] = x.am(0, y2.data[i], r, i, 0, x.t);
      r.s = 0;
      r.clamp();
      if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
    }
    function bnpSquareTo(r) {
      var x = this.abs();
      var i = r.t = 2 * x.t;
      while (--i >= 0) r.data[i] = 0;
      for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x.data[i], r, 2 * i, 0, 1);
        if ((r.data[i + x.t] += x.am(i + 1, 2 * x.data[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
          r.data[i + x.t] -= x.DV;
          r.data[i + x.t + 1] = 1;
        }
      }
      if (r.t > 0) r.data[r.t - 1] += x.am(i, x.data[i], r, 2 * i, 0, 1);
      r.s = 0;
      r.clamp();
    }
    function bnpDivRemTo(m, q2, r) {
      var pm = m.abs();
      if (pm.t <= 0) return;
      var pt = this.abs();
      if (pt.t < pm.t) {
        if (q2 != null) q2.fromInt(0);
        if (r != null) this.copyTo(r);
        return;
      }
      if (r == null) r = nbi();
      var y2 = nbi(), ts = this.s, ms = m.s;
      var nsh = this.DB - nbits(pm.data[pm.t - 1]);
      if (nsh > 0) {
        pm.lShiftTo(nsh, y2);
        pt.lShiftTo(nsh, r);
      } else {
        pm.copyTo(y2);
        pt.copyTo(r);
      }
      var ys = y2.t;
      var y0 = y2.data[ys - 1];
      if (y0 == 0) return;
      var yt = y0 * (1 << this.F1) + (ys > 1 ? y2.data[ys - 2] >> this.F2 : 0);
      var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e2 = 1 << this.F2;
      var i = r.t, j = i - ys, t2 = q2 == null ? nbi() : q2;
      y2.dlShiftTo(j, t2);
      if (r.compareTo(t2) >= 0) {
        r.data[r.t++] = 1;
        r.subTo(t2, r);
      }
      BigInteger.ONE.dlShiftTo(ys, t2);
      t2.subTo(y2, y2);
      while (y2.t < ys) y2.data[y2.t++] = 0;
      while (--j >= 0) {
        var qd = r.data[--i] == y0 ? this.DM : Math.floor(r.data[i] * d1 + (r.data[i - 1] + e2) * d2);
        if ((r.data[i] += y2.am(0, qd, r, j, 0, ys)) < qd) {
          y2.dlShiftTo(j, t2);
          r.subTo(t2, r);
          while (r.data[i] < --qd) r.subTo(t2, r);
        }
      }
      if (q2 != null) {
        r.drShiftTo(ys, q2);
        if (ts != ms) BigInteger.ZERO.subTo(q2, q2);
      }
      r.t = ys;
      r.clamp();
      if (nsh > 0) r.rShiftTo(nsh, r);
      if (ts < 0) BigInteger.ZERO.subTo(r, r);
    }
    function bnMod(a) {
      var r = nbi();
      this.abs().divRemTo(a, null, r);
      if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
      return r;
    }
    function Classic(m) {
      this.m = m;
    }
    function cConvert(x) {
      if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
      else return x;
    }
    function cRevert(x) {
      return x;
    }
    function cReduce(x) {
      x.divRemTo(this.m, null, x);
    }
    function cMulTo(x, y2, r) {
      x.multiplyTo(y2, r);
      this.reduce(r);
    }
    function cSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;
    function bnpInvDigit() {
      if (this.t < 1) return 0;
      var x = this.data[0];
      if ((x & 1) == 0) return 0;
      var y2 = x & 3;
      y2 = y2 * (2 - (x & 15) * y2) & 15;
      y2 = y2 * (2 - (x & 255) * y2) & 255;
      y2 = y2 * (2 - ((x & 65535) * y2 & 65535)) & 65535;
      y2 = y2 * (2 - x * y2 % this.DV) % this.DV;
      return y2 > 0 ? this.DV - y2 : -y2;
    }
    function Montgomery(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp & 32767;
      this.mph = this.mp >> 15;
      this.um = (1 << m.DB - 15) - 1;
      this.mt2 = 2 * m.t;
    }
    function montConvert(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t, r);
      r.divRemTo(this.m, null, r);
      if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
      return r;
    }
    function montRevert(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
    function montReduce(x) {
      while (x.t <= this.mt2)
        x.data[x.t++] = 0;
      for (var i = 0; i < this.m.t; ++i) {
        var j = x.data[i] & 32767;
        var u0 = j * this.mpl + ((j * this.mph + (x.data[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
        j = i + this.m.t;
        x.data[j] += this.m.am(0, u0, x, i, 0, this.m.t);
        while (x.data[j] >= x.DV) {
          x.data[j] -= x.DV;
          x.data[++j]++;
        }
      }
      x.clamp();
      x.drShiftTo(this.m.t, x);
      if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
    }
    function montSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    function montMulTo(x, y2, r) {
      x.multiplyTo(y2, r);
      this.reduce(r);
    }
    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;
    function bnpIsEven() {
      return (this.t > 0 ? this.data[0] & 1 : this.s) == 0;
    }
    function bnpExp(e2, z) {
      if (e2 > 4294967295 || e2 < 1) return BigInteger.ONE;
      var r = nbi(), r2 = nbi(), g2 = z.convert(this), i = nbits(e2) - 1;
      g2.copyTo(r);
      while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e2 & 1 << i) > 0) z.mulTo(r2, g2, r);
        else {
          var t2 = r;
          r = r2;
          r2 = t2;
        }
      }
      return z.revert(r);
    }
    function bnModPowInt(e2, m) {
      var z;
      if (e2 < 256 || m.isEven()) z = new Classic(m);
      else z = new Montgomery(m);
      return this.exp(e2, z);
    }
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);
    function bnClone() {
      var r = nbi();
      this.copyTo(r);
      return r;
    }
    function bnIntValue() {
      if (this.s < 0) {
        if (this.t == 1) return this.data[0] - this.DV;
        else if (this.t == 0) return -1;
      } else if (this.t == 1) return this.data[0];
      else if (this.t == 0) return 0;
      return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
    }
    function bnByteValue() {
      return this.t == 0 ? this.s : this.data[0] << 24 >> 24;
    }
    function bnShortValue() {
      return this.t == 0 ? this.s : this.data[0] << 16 >> 16;
    }
    function bnpChunkSize(r) {
      return Math.floor(Math.LN2 * this.DB / Math.log(r));
    }
    function bnSigNum() {
      if (this.s < 0) return -1;
      else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0) return 0;
      else return 1;
    }
    function bnpToRadix(b2) {
      if (b2 == null) b2 = 10;
      if (this.signum() == 0 || b2 < 2 || b2 > 36) return "0";
      var cs = this.chunkSize(b2);
      var a = Math.pow(b2, cs);
      var d2 = nbv(a), y2 = nbi(), z = nbi(), r = "";
      this.divRemTo(d2, y2, z);
      while (y2.signum() > 0) {
        r = (a + z.intValue()).toString(b2).substr(1) + r;
        y2.divRemTo(d2, y2, z);
      }
      return z.intValue().toString(b2) + r;
    }
    function bnpFromRadix(s, b2) {
      this.fromInt(0);
      if (b2 == null) b2 = 10;
      var cs = this.chunkSize(b2);
      var d2 = Math.pow(b2, cs), mi = false, j = 0, w2 = 0;
      for (var i = 0; i < s.length; ++i) {
        var x = intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
          continue;
        }
        w2 = b2 * w2 + x;
        if (++j >= cs) {
          this.dMultiply(d2);
          this.dAddOffset(w2, 0);
          j = 0;
          w2 = 0;
        }
      }
      if (j > 0) {
        this.dMultiply(Math.pow(b2, j));
        this.dAddOffset(w2, 0);
      }
      if (mi) BigInteger.ZERO.subTo(this, this);
    }
    function bnpFromNumber(a, b2, c) {
      if ("number" == typeof b2) {
        if (a < 2) this.fromInt(1);
        else {
          this.fromNumber(a, c);
          if (!this.testBit(a - 1))
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
          if (this.isEven()) this.dAddOffset(1, 0);
          while (!this.isProbablePrime(b2)) {
            this.dAddOffset(2, 0);
            if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
          }
        }
      } else {
        var x = new Array(), t2 = a & 7;
        x.length = (a >> 3) + 1;
        b2.nextBytes(x);
        if (t2 > 0) x[0] &= (1 << t2) - 1;
        else x[0] = 0;
        this.fromString(x, 256);
      }
    }
    function bnToByteArray() {
      var i = this.t, r = new Array();
      r[0] = this.s;
      var p2 = this.DB - i * this.DB % 8, d2, k = 0;
      if (i-- > 0) {
        if (p2 < this.DB && (d2 = this.data[i] >> p2) != (this.s & this.DM) >> p2)
          r[k++] = d2 | this.s << this.DB - p2;
        while (i >= 0) {
          if (p2 < 8) {
            d2 = (this.data[i] & (1 << p2) - 1) << 8 - p2;
            d2 |= this.data[--i] >> (p2 += this.DB - 8);
          } else {
            d2 = this.data[i] >> (p2 -= 8) & 255;
            if (p2 <= 0) {
              p2 += this.DB;
              --i;
            }
          }
          if ((d2 & 128) != 0) d2 |= -256;
          if (k == 0 && (this.s & 128) != (d2 & 128)) ++k;
          if (k > 0 || d2 != this.s) r[k++] = d2;
        }
      }
      return r;
    }
    function bnEquals(a) {
      return this.compareTo(a) == 0;
    }
    function bnMin(a) {
      return this.compareTo(a) < 0 ? this : a;
    }
    function bnMax(a) {
      return this.compareTo(a) > 0 ? this : a;
    }
    function bnpBitwiseTo(a, op, r) {
      var i, f2, m = Math.min(a.t, this.t);
      for (i = 0; i < m; ++i) r.data[i] = op(this.data[i], a.data[i]);
      if (a.t < this.t) {
        f2 = a.s & this.DM;
        for (i = m; i < this.t; ++i) r.data[i] = op(this.data[i], f2);
        r.t = this.t;
      } else {
        f2 = this.s & this.DM;
        for (i = m; i < a.t; ++i) r.data[i] = op(f2, a.data[i]);
        r.t = a.t;
      }
      r.s = op(this.s, a.s);
      r.clamp();
    }
    function op_and(x, y2) {
      return x & y2;
    }
    function bnAnd(a) {
      var r = nbi();
      this.bitwiseTo(a, op_and, r);
      return r;
    }
    function op_or(x, y2) {
      return x | y2;
    }
    function bnOr(a) {
      var r = nbi();
      this.bitwiseTo(a, op_or, r);
      return r;
    }
    function op_xor(x, y2) {
      return x ^ y2;
    }
    function bnXor(a) {
      var r = nbi();
      this.bitwiseTo(a, op_xor, r);
      return r;
    }
    function op_andnot(x, y2) {
      return x & ~y2;
    }
    function bnAndNot(a) {
      var r = nbi();
      this.bitwiseTo(a, op_andnot, r);
      return r;
    }
    function bnNot() {
      var r = nbi();
      for (var i = 0; i < this.t; ++i) r.data[i] = this.DM & ~this.data[i];
      r.t = this.t;
      r.s = ~this.s;
      return r;
    }
    function bnShiftLeft(n2) {
      var r = nbi();
      if (n2 < 0) this.rShiftTo(-n2, r);
      else this.lShiftTo(n2, r);
      return r;
    }
    function bnShiftRight(n2) {
      var r = nbi();
      if (n2 < 0) this.lShiftTo(-n2, r);
      else this.rShiftTo(n2, r);
      return r;
    }
    function lbit(x) {
      if (x == 0) return -1;
      var r = 0;
      if ((x & 65535) == 0) {
        x >>= 16;
        r += 16;
      }
      if ((x & 255) == 0) {
        x >>= 8;
        r += 8;
      }
      if ((x & 15) == 0) {
        x >>= 4;
        r += 4;
      }
      if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
      }
      if ((x & 1) == 0) ++r;
      return r;
    }
    function bnGetLowestSetBit() {
      for (var i = 0; i < this.t; ++i)
        if (this.data[i] != 0) return i * this.DB + lbit(this.data[i]);
      if (this.s < 0) return this.t * this.DB;
      return -1;
    }
    function cbit(x) {
      var r = 0;
      while (x != 0) {
        x &= x - 1;
        ++r;
      }
      return r;
    }
    function bnBitCount() {
      var r = 0, x = this.s & this.DM;
      for (var i = 0; i < this.t; ++i) r += cbit(this.data[i] ^ x);
      return r;
    }
    function bnTestBit(n2) {
      var j = Math.floor(n2 / this.DB);
      if (j >= this.t) return this.s != 0;
      return (this.data[j] & 1 << n2 % this.DB) != 0;
    }
    function bnpChangeBit(n2, op) {
      var r = BigInteger.ONE.shiftLeft(n2);
      this.bitwiseTo(r, op, r);
      return r;
    }
    function bnSetBit(n2) {
      return this.changeBit(n2, op_or);
    }
    function bnClearBit(n2) {
      return this.changeBit(n2, op_andnot);
    }
    function bnFlipBit(n2) {
      return this.changeBit(n2, op_xor);
    }
    function bnpAddTo(a, r) {
      var i = 0, c = 0, m = Math.min(a.t, this.t);
      while (i < m) {
        c += this.data[i] + a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      if (a.t < this.t) {
        c += a.s;
        while (i < this.t) {
          c += this.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += this.s;
      } else {
        c += this.s;
        while (i < a.t) {
          c += a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += a.s;
      }
      r.s = c < 0 ? -1 : 0;
      if (c > 0) r.data[i++] = c;
      else if (c < -1) r.data[i++] = this.DV + c;
      r.t = i;
      r.clamp();
    }
    function bnAdd(a) {
      var r = nbi();
      this.addTo(a, r);
      return r;
    }
    function bnSubtract(a) {
      var r = nbi();
      this.subTo(a, r);
      return r;
    }
    function bnMultiply(a) {
      var r = nbi();
      this.multiplyTo(a, r);
      return r;
    }
    function bnDivide(a) {
      var r = nbi();
      this.divRemTo(a, r, null);
      return r;
    }
    function bnRemainder(a) {
      var r = nbi();
      this.divRemTo(a, null, r);
      return r;
    }
    function bnDivideAndRemainder(a) {
      var q2 = nbi(), r = nbi();
      this.divRemTo(a, q2, r);
      return new Array(q2, r);
    }
    function bnpDMultiply(n2) {
      this.data[this.t] = this.am(0, n2 - 1, this, 0, 0, this.t);
      ++this.t;
      this.clamp();
    }
    function bnpDAddOffset(n2, w2) {
      if (n2 == 0) return;
      while (this.t <= w2) this.data[this.t++] = 0;
      this.data[w2] += n2;
      while (this.data[w2] >= this.DV) {
        this.data[w2] -= this.DV;
        if (++w2 >= this.t) this.data[this.t++] = 0;
        ++this.data[w2];
      }
    }
    function NullExp() {
    }
    function nNop(x) {
      return x;
    }
    function nMulTo(x, y2, r) {
      x.multiplyTo(y2, r);
    }
    function nSqrTo(x, r) {
      x.squareTo(r);
    }
    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;
    function bnPow(e2) {
      return this.exp(e2, new NullExp());
    }
    function bnpMultiplyLowerTo(a, n2, r) {
      var i = Math.min(this.t + a.t, n2);
      r.s = 0;
      r.t = i;
      while (i > 0) r.data[--i] = 0;
      var j;
      for (j = r.t - this.t; i < j; ++i) r.data[i + this.t] = this.am(0, a.data[i], r, i, 0, this.t);
      for (j = Math.min(a.t, n2); i < j; ++i) this.am(0, a.data[i], r, i, 0, n2 - i);
      r.clamp();
    }
    function bnpMultiplyUpperTo(a, n2, r) {
      --n2;
      var i = r.t = this.t + a.t - n2;
      r.s = 0;
      while (--i >= 0) r.data[i] = 0;
      for (i = Math.max(n2 - this.t, 0); i < a.t; ++i)
        r.data[this.t + i - n2] = this.am(n2 - i, a.data[i], r, 0, 0, this.t + i - n2);
      r.clamp();
      r.drShiftTo(1, r);
    }
    function Barrett(m) {
      this.r2 = nbi();
      this.q3 = nbi();
      BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
      this.mu = this.r2.divide(m);
      this.m = m;
    }
    function barrettConvert(x) {
      if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
      else if (x.compareTo(this.m) < 0) return x;
      else {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }
    }
    function barrettRevert(x) {
      return x;
    }
    function barrettReduce(x) {
      x.drShiftTo(this.m.t - 1, this.r2);
      if (x.t > this.m.t + 1) {
        x.t = this.m.t + 1;
        x.clamp();
      }
      this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
      this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
      while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
      x.subTo(this.r2, x);
      while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
    }
    function barrettSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    function barrettMulTo(x, y2, r) {
      x.multiplyTo(y2, r);
      this.reduce(r);
    }
    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;
    function bnModPow(e2, m) {
      var i = e2.bitLength(), k, r = nbv(1), z;
      if (i <= 0) return r;
      else if (i < 18) k = 1;
      else if (i < 48) k = 3;
      else if (i < 144) k = 4;
      else if (i < 768) k = 5;
      else k = 6;
      if (i < 8)
        z = new Classic(m);
      else if (m.isEven())
        z = new Barrett(m);
      else
        z = new Montgomery(m);
      var g2 = new Array(), n2 = 3, k1 = k - 1, km = (1 << k) - 1;
      g2[1] = z.convert(this);
      if (k > 1) {
        var g22 = nbi();
        z.sqrTo(g2[1], g22);
        while (n2 <= km) {
          g2[n2] = nbi();
          z.mulTo(g22, g2[n2 - 2], g2[n2]);
          n2 += 2;
        }
      }
      var j = e2.t - 1, w2, is1 = true, r2 = nbi(), t2;
      i = nbits(e2.data[j]) - 1;
      while (j >= 0) {
        if (i >= k1) w2 = e2.data[j] >> i - k1 & km;
        else {
          w2 = (e2.data[j] & (1 << i + 1) - 1) << k1 - i;
          if (j > 0) w2 |= e2.data[j - 1] >> this.DB + i - k1;
        }
        n2 = k;
        while ((w2 & 1) == 0) {
          w2 >>= 1;
          --n2;
        }
        if ((i -= n2) < 0) {
          i += this.DB;
          --j;
        }
        if (is1) {
          g2[w2].copyTo(r);
          is1 = false;
        } else {
          while (n2 > 1) {
            z.sqrTo(r, r2);
            z.sqrTo(r2, r);
            n2 -= 2;
          }
          if (n2 > 0) z.sqrTo(r, r2);
          else {
            t2 = r;
            r = r2;
            r2 = t2;
          }
          z.mulTo(r2, g2[w2], r);
        }
        while (j >= 0 && (e2.data[j] & 1 << i) == 0) {
          z.sqrTo(r, r2);
          t2 = r;
          r = r2;
          r2 = t2;
          if (--i < 0) {
            i = this.DB - 1;
            --j;
          }
        }
      }
      return z.revert(r);
    }
    function bnGCD(a) {
      var x = this.s < 0 ? this.negate() : this.clone();
      var y2 = a.s < 0 ? a.negate() : a.clone();
      if (x.compareTo(y2) < 0) {
        var t2 = x;
        x = y2;
        y2 = t2;
      }
      var i = x.getLowestSetBit(), g2 = y2.getLowestSetBit();
      if (g2 < 0) return x;
      if (i < g2) g2 = i;
      if (g2 > 0) {
        x.rShiftTo(g2, x);
        y2.rShiftTo(g2, y2);
      }
      while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
        if ((i = y2.getLowestSetBit()) > 0) y2.rShiftTo(i, y2);
        if (x.compareTo(y2) >= 0) {
          x.subTo(y2, x);
          x.rShiftTo(1, x);
        } else {
          y2.subTo(x, y2);
          y2.rShiftTo(1, y2);
        }
      }
      if (g2 > 0) y2.lShiftTo(g2, y2);
      return y2;
    }
    function bnpModInt(n2) {
      if (n2 <= 0) return 0;
      var d2 = this.DV % n2, r = this.s < 0 ? n2 - 1 : 0;
      if (this.t > 0)
        if (d2 == 0) r = this.data[0] % n2;
        else for (var i = this.t - 1; i >= 0; --i) r = (d2 * r + this.data[i]) % n2;
      return r;
    }
    function bnModInverse(m) {
      var ac = m.isEven();
      if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
      var u = m.clone(), v2 = this.clone();
      var a = nbv(1), b2 = nbv(0), c = nbv(0), d2 = nbv(1);
      while (u.signum() != 0) {
        while (u.isEven()) {
          u.rShiftTo(1, u);
          if (ac) {
            if (!a.isEven() || !b2.isEven()) {
              a.addTo(this, a);
              b2.subTo(m, b2);
            }
            a.rShiftTo(1, a);
          } else if (!b2.isEven()) b2.subTo(m, b2);
          b2.rShiftTo(1, b2);
        }
        while (v2.isEven()) {
          v2.rShiftTo(1, v2);
          if (ac) {
            if (!c.isEven() || !d2.isEven()) {
              c.addTo(this, c);
              d2.subTo(m, d2);
            }
            c.rShiftTo(1, c);
          } else if (!d2.isEven()) d2.subTo(m, d2);
          d2.rShiftTo(1, d2);
        }
        if (u.compareTo(v2) >= 0) {
          u.subTo(v2, u);
          if (ac) a.subTo(c, a);
          b2.subTo(d2, b2);
        } else {
          v2.subTo(u, v2);
          if (ac) c.subTo(a, c);
          d2.subTo(b2, d2);
        }
      }
      if (v2.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
      if (d2.compareTo(m) >= 0) return d2.subtract(m);
      if (d2.signum() < 0) d2.addTo(m, d2);
      else return d2;
      if (d2.signum() < 0) return d2.add(m);
      else return d2;
    }
    var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
    var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
    function bnIsProbablePrime(t2) {
      var i, x = this.abs();
      if (x.t == 1 && x.data[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i)
          if (x.data[0] == lowprimes[i]) return true;
        return false;
      }
      if (x.isEven()) return false;
      i = 1;
      while (i < lowprimes.length) {
        var m = lowprimes[i], j = i + 1;
        while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
        m = x.modInt(m);
        while (i < j) if (m % lowprimes[i++] == 0) return false;
      }
      return x.millerRabin(t2);
    }
    function bnpMillerRabin(t2) {
      var n1 = this.subtract(BigInteger.ONE);
      var k = n1.getLowestSetBit();
      if (k <= 0) return false;
      var r = n1.shiftRight(k);
      var prng = bnGetPrng();
      var a;
      for (var i = 0; i < t2; ++i) {
        do {
          a = new BigInteger(this.bitLength(), prng);
        } while (a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);
        var y2 = a.modPow(r, this);
        if (y2.compareTo(BigInteger.ONE) != 0 && y2.compareTo(n1) != 0) {
          var j = 1;
          while (j++ < k && y2.compareTo(n1) != 0) {
            y2 = y2.modPowInt(2, this);
            if (y2.compareTo(BigInteger.ONE) == 0) return false;
          }
          if (y2.compareTo(n1) != 0) return false;
        }
      }
      return true;
    }
    function bnGetPrng() {
      return {
        // x is an array to fill with bytes
        nextBytes: function(x) {
          for (var i = 0; i < x.length; ++i) {
            x[i] = Math.floor(Math.random() * 256);
          }
        }
      };
    }
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
  }
});

// node_modules/node-forge/lib/sha1.js
var require_sha1 = __commonJS({
  "node_modules/node-forge/lib/sha1.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_md();
    require_util();
    var sha1 = module2.exports = forge.sha1 = forge.sha1 || {};
    forge.md.sha1 = forge.md.algorithms.sha1 = sha1;
    sha1.create = function() {
      if (!_initialized) {
        _init();
      }
      var _state = null;
      var _input = forge.util.createBuffer();
      var _w = new Array(80);
      var md = {
        algorithm: "sha1",
        blockLength: 64,
        digestLength: 20,
        // 56-bit length of message so far (does not including padding)
        messageLength: 0,
        // true message length
        fullMessageLength: null,
        // size of message length in bytes
        messageLengthSize: 8
      };
      md.start = function() {
        md.messageLength = 0;
        md.fullMessageLength = md.messageLength64 = [];
        var int32s = md.messageLengthSize / 4;
        for (var i = 0; i < int32s; ++i) {
          md.fullMessageLength.push(0);
        }
        _input = forge.util.createBuffer();
        _state = {
          h0: 1732584193,
          h1: 4023233417,
          h2: 2562383102,
          h3: 271733878,
          h4: 3285377520
        };
        return md;
      };
      md.start();
      md.update = function(msg, encoding) {
        if (encoding === "utf8") {
          msg = forge.util.encodeUtf8(msg);
        }
        var len = msg.length;
        md.messageLength += len;
        len = [len / 4294967296 >>> 0, len >>> 0];
        for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
          md.fullMessageLength[i] += len[1];
          len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
          md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
          len[0] = len[1] / 4294967296 >>> 0;
        }
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
          _input.compact();
        }
        return md;
      };
      md.digest = function() {
        var finalBlock = forge.util.createBuffer();
        finalBlock.putBytes(_input.bytes());
        var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
        var overflow = remaining & md.blockLength - 1;
        finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
        var next, carry;
        var bits = md.fullMessageLength[0] * 8;
        for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
          next = md.fullMessageLength[i + 1] * 8;
          carry = next / 4294967296 >>> 0;
          bits += carry;
          finalBlock.putInt32(bits >>> 0);
          bits = next >>> 0;
        }
        finalBlock.putInt32(bits);
        var s2 = {
          h0: _state.h0,
          h1: _state.h1,
          h2: _state.h2,
          h3: _state.h3,
          h4: _state.h4
        };
        _update(s2, _w, finalBlock);
        var rval = forge.util.createBuffer();
        rval.putInt32(s2.h0);
        rval.putInt32(s2.h1);
        rval.putInt32(s2.h2);
        rval.putInt32(s2.h3);
        rval.putInt32(s2.h4);
        return rval;
      };
      return md;
    };
    var _padding = null;
    var _initialized = false;
    function _init() {
      _padding = String.fromCharCode(128);
      _padding += forge.util.fillString(String.fromCharCode(0), 64);
      _initialized = true;
    }
    function _update(s, w2, bytes) {
      var t2, a, b2, c, d2, e2, f2, i;
      var len = bytes.length();
      while (len >= 64) {
        a = s.h0;
        b2 = s.h1;
        c = s.h2;
        d2 = s.h3;
        e2 = s.h4;
        for (i = 0; i < 16; ++i) {
          t2 = bytes.getInt32();
          w2[i] = t2;
          f2 = d2 ^ b2 & (c ^ d2);
          t2 = (a << 5 | a >>> 27) + f2 + e2 + 1518500249 + t2;
          e2 = d2;
          d2 = c;
          c = (b2 << 30 | b2 >>> 2) >>> 0;
          b2 = a;
          a = t2;
        }
        for (; i < 20; ++i) {
          t2 = w2[i - 3] ^ w2[i - 8] ^ w2[i - 14] ^ w2[i - 16];
          t2 = t2 << 1 | t2 >>> 31;
          w2[i] = t2;
          f2 = d2 ^ b2 & (c ^ d2);
          t2 = (a << 5 | a >>> 27) + f2 + e2 + 1518500249 + t2;
          e2 = d2;
          d2 = c;
          c = (b2 << 30 | b2 >>> 2) >>> 0;
          b2 = a;
          a = t2;
        }
        for (; i < 32; ++i) {
          t2 = w2[i - 3] ^ w2[i - 8] ^ w2[i - 14] ^ w2[i - 16];
          t2 = t2 << 1 | t2 >>> 31;
          w2[i] = t2;
          f2 = b2 ^ c ^ d2;
          t2 = (a << 5 | a >>> 27) + f2 + e2 + 1859775393 + t2;
          e2 = d2;
          d2 = c;
          c = (b2 << 30 | b2 >>> 2) >>> 0;
          b2 = a;
          a = t2;
        }
        for (; i < 40; ++i) {
          t2 = w2[i - 6] ^ w2[i - 16] ^ w2[i - 28] ^ w2[i - 32];
          t2 = t2 << 2 | t2 >>> 30;
          w2[i] = t2;
          f2 = b2 ^ c ^ d2;
          t2 = (a << 5 | a >>> 27) + f2 + e2 + 1859775393 + t2;
          e2 = d2;
          d2 = c;
          c = (b2 << 30 | b2 >>> 2) >>> 0;
          b2 = a;
          a = t2;
        }
        for (; i < 60; ++i) {
          t2 = w2[i - 6] ^ w2[i - 16] ^ w2[i - 28] ^ w2[i - 32];
          t2 = t2 << 2 | t2 >>> 30;
          w2[i] = t2;
          f2 = b2 & c | d2 & (b2 ^ c);
          t2 = (a << 5 | a >>> 27) + f2 + e2 + 2400959708 + t2;
          e2 = d2;
          d2 = c;
          c = (b2 << 30 | b2 >>> 2) >>> 0;
          b2 = a;
          a = t2;
        }
        for (; i < 80; ++i) {
          t2 = w2[i - 6] ^ w2[i - 16] ^ w2[i - 28] ^ w2[i - 32];
          t2 = t2 << 2 | t2 >>> 30;
          w2[i] = t2;
          f2 = b2 ^ c ^ d2;
          t2 = (a << 5 | a >>> 27) + f2 + e2 + 3395469782 + t2;
          e2 = d2;
          d2 = c;
          c = (b2 << 30 | b2 >>> 2) >>> 0;
          b2 = a;
          a = t2;
        }
        s.h0 = s.h0 + a | 0;
        s.h1 = s.h1 + b2 | 0;
        s.h2 = s.h2 + c | 0;
        s.h3 = s.h3 + d2 | 0;
        s.h4 = s.h4 + e2 | 0;
        len -= 64;
      }
    }
  }
});

// node_modules/node-forge/lib/pkcs1.js
var require_pkcs1 = __commonJS({
  "node_modules/node-forge/lib/pkcs1.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    require_random();
    require_sha1();
    var pkcs1 = module2.exports = forge.pkcs1 = forge.pkcs1 || {};
    pkcs1.encode_rsa_oaep = function(key, message, options) {
      var label;
      var seed;
      var md;
      var mgf1Md;
      if (typeof options === "string") {
        label = options;
        seed = arguments[3] || void 0;
        md = arguments[4] || void 0;
      } else if (options) {
        label = options.label || void 0;
        seed = options.seed || void 0;
        md = options.md || void 0;
        if (options.mgf1 && options.mgf1.md) {
          mgf1Md = options.mgf1.md;
        }
      }
      if (!md) {
        md = forge.md.sha1.create();
      } else {
        md.start();
      }
      if (!mgf1Md) {
        mgf1Md = md;
      }
      var keyLength = Math.ceil(key.n.bitLength() / 8);
      var maxLength = keyLength - 2 * md.digestLength - 2;
      if (message.length > maxLength) {
        var error = new Error("RSAES-OAEP input message length is too long.");
        error.length = message.length;
        error.maxLength = maxLength;
        throw error;
      }
      if (!label) {
        label = "";
      }
      md.update(label, "raw");
      var lHash = md.digest();
      var PS = "";
      var PS_length = maxLength - message.length;
      for (var i = 0; i < PS_length; i++) {
        PS += "\0";
      }
      var DB = lHash.getBytes() + PS + "" + message;
      if (!seed) {
        seed = forge.random.getBytes(md.digestLength);
      } else if (seed.length !== md.digestLength) {
        var error = new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.");
        error.seedLength = seed.length;
        error.digestLength = md.digestLength;
        throw error;
      }
      var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
      var maskedDB = forge.util.xorBytes(DB, dbMask, DB.length);
      var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
      var maskedSeed = forge.util.xorBytes(seed, seedMask, seed.length);
      return "\0" + maskedSeed + maskedDB;
    };
    pkcs1.decode_rsa_oaep = function(key, em, options) {
      var label;
      var md;
      var mgf1Md;
      if (typeof options === "string") {
        label = options;
        md = arguments[3] || void 0;
      } else if (options) {
        label = options.label || void 0;
        md = options.md || void 0;
        if (options.mgf1 && options.mgf1.md) {
          mgf1Md = options.mgf1.md;
        }
      }
      var keyLength = Math.ceil(key.n.bitLength() / 8);
      if (em.length !== keyLength) {
        var error = new Error("RSAES-OAEP encoded message length is invalid.");
        error.length = em.length;
        error.expectedLength = keyLength;
        throw error;
      }
      if (md === void 0) {
        md = forge.md.sha1.create();
      } else {
        md.start();
      }
      if (!mgf1Md) {
        mgf1Md = md;
      }
      if (keyLength < 2 * md.digestLength + 2) {
        throw new Error("RSAES-OAEP key is too short for the hash function.");
      }
      if (!label) {
        label = "";
      }
      md.update(label, "raw");
      var lHash = md.digest().getBytes();
      var y2 = em.charAt(0);
      var maskedSeed = em.substring(1, md.digestLength + 1);
      var maskedDB = em.substring(1 + md.digestLength);
      var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
      var seed = forge.util.xorBytes(maskedSeed, seedMask, maskedSeed.length);
      var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
      var db = forge.util.xorBytes(maskedDB, dbMask, maskedDB.length);
      var lHashPrime = db.substring(0, md.digestLength);
      var error = y2 !== "\0";
      for (var i = 0; i < md.digestLength; ++i) {
        error |= lHash.charAt(i) !== lHashPrime.charAt(i);
      }
      var in_ps = 1;
      var index = md.digestLength;
      for (var j = md.digestLength; j < db.length; j++) {
        var code2 = db.charCodeAt(j);
        var is_0 = code2 & 1 ^ 1;
        var error_mask = in_ps ? 65534 : 0;
        error |= code2 & error_mask;
        in_ps = in_ps & is_0;
        index += in_ps;
      }
      if (error || db.charCodeAt(index) !== 1) {
        throw new Error("Invalid RSAES-OAEP padding.");
      }
      return db.substring(index + 1);
    };
    function rsa_mgf1(seed, maskLength, hash) {
      if (!hash) {
        hash = forge.md.sha1.create();
      }
      var t2 = "";
      var count = Math.ceil(maskLength / hash.digestLength);
      for (var i = 0; i < count; ++i) {
        var c = String.fromCharCode(
          i >> 24 & 255,
          i >> 16 & 255,
          i >> 8 & 255,
          i & 255
        );
        hash.start();
        hash.update(seed + c);
        t2 += hash.digest().getBytes();
      }
      return t2.substring(0, maskLength);
    }
  }
});

// node_modules/node-forge/lib/prime.js
var require_prime = __commonJS({
  "node_modules/node-forge/lib/prime.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_util();
    require_jsbn();
    require_random();
    (function() {
      if (forge.prime) {
        module2.exports = forge.prime;
        return;
      }
      var prime = module2.exports = forge.prime = forge.prime || {};
      var BigInteger = forge.jsbn.BigInteger;
      var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
      var THIRTY = new BigInteger(null);
      THIRTY.fromInt(30);
      var op_or = function(x, y2) {
        return x | y2;
      };
      prime.generateProbablePrime = function(bits, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = options || {};
        var algorithm = options.algorithm || "PRIMEINC";
        if (typeof algorithm === "string") {
          algorithm = { name: algorithm };
        }
        algorithm.options = algorithm.options || {};
        var prng = options.prng || forge.random;
        var rng = {
          // x is an array to fill with bytes
          nextBytes: function(x) {
            var b2 = prng.getBytesSync(x.length);
            for (var i = 0; i < x.length; ++i) {
              x[i] = b2.charCodeAt(i);
            }
          }
        };
        if (algorithm.name === "PRIMEINC") {
          return primeincFindPrime(bits, rng, algorithm.options, callback);
        }
        throw new Error("Invalid prime generation algorithm: " + algorithm.name);
      };
      function primeincFindPrime(bits, rng, options, callback) {
        if ("workers" in options) {
          return primeincFindPrimeWithWorkers(bits, rng, options, callback);
        }
        return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
      }
      function primeincFindPrimeWithoutWorkers(bits, rng, options, callback) {
        var num = generateRandom(bits, rng);
        var deltaIdx = 0;
        var mrTests = getMillerRabinTests(num.bitLength());
        if ("millerRabinTests" in options) {
          mrTests = options.millerRabinTests;
        }
        var maxBlockTime = 10;
        if ("maxBlockTime" in options) {
          maxBlockTime = options.maxBlockTime;
        }
        _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
      }
      function _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback) {
        var start = +/* @__PURE__ */ new Date();
        do {
          if (num.bitLength() > bits) {
            num = generateRandom(bits, rng);
          }
          if (num.isProbablePrime(mrTests)) {
            return callback(null, num);
          }
          num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
        } while (maxBlockTime < 0 || +/* @__PURE__ */ new Date() - start < maxBlockTime);
        forge.util.setImmediate(function() {
          _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
        });
      }
      function primeincFindPrimeWithWorkers(bits, rng, options, callback) {
        if (typeof Worker === "undefined") {
          return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
        }
        var num = generateRandom(bits, rng);
        var numWorkers = options.workers;
        var workLoad = options.workLoad || 100;
        var range = workLoad * 30 / 8;
        var workerScript = options.workerScript || "forge/prime.worker.js";
        if (numWorkers === -1) {
          return forge.util.estimateCores(function(err, cores) {
            if (err) {
              cores = 2;
            }
            numWorkers = cores - 1;
            generate();
          });
        }
        generate();
        function generate() {
          numWorkers = Math.max(1, numWorkers);
          var workers = [];
          for (var i = 0; i < numWorkers; ++i) {
            workers[i] = new Worker(workerScript);
          }
          var running = numWorkers;
          for (var i = 0; i < numWorkers; ++i) {
            workers[i].addEventListener("message", workerMessage);
          }
          var found = false;
          function workerMessage(e2) {
            if (found) {
              return;
            }
            --running;
            var data = e2.data;
            if (data.found) {
              for (var i2 = 0; i2 < workers.length; ++i2) {
                workers[i2].terminate();
              }
              found = true;
              return callback(null, new BigInteger(data.prime, 16));
            }
            if (num.bitLength() > bits) {
              num = generateRandom(bits, rng);
            }
            var hex = num.toString(16);
            e2.target.postMessage({
              hex,
              workLoad
            });
            num.dAddOffset(range, 0);
          }
        }
      }
      function generateRandom(bits, rng) {
        var num = new BigInteger(bits, rng);
        var bits1 = bits - 1;
        if (!num.testBit(bits1)) {
          num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
        }
        num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0);
        return num;
      }
      function getMillerRabinTests(bits) {
        if (bits <= 100) return 27;
        if (bits <= 150) return 18;
        if (bits <= 200) return 15;
        if (bits <= 250) return 12;
        if (bits <= 300) return 9;
        if (bits <= 350) return 8;
        if (bits <= 400) return 7;
        if (bits <= 500) return 6;
        if (bits <= 600) return 5;
        if (bits <= 800) return 4;
        if (bits <= 1250) return 3;
        return 2;
      }
    })();
  }
});

// node_modules/node-forge/lib/rsa.js
var require_rsa = __commonJS({
  "node_modules/node-forge/lib/rsa.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_asn1();
    require_jsbn();
    require_oids();
    require_pkcs1();
    require_prime();
    require_random();
    require_util();
    if (typeof BigInteger === "undefined") {
      BigInteger = forge.jsbn.BigInteger;
    }
    var BigInteger;
    var _crypto = forge.util.isNodejs ? require_crypto() : null;
    var asn1 = forge.asn1;
    var util = forge.util;
    forge.pki = forge.pki || {};
    module2.exports = forge.pki.rsa = forge.rsa = forge.rsa || {};
    var pki = forge.pki;
    var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
    var privateKeyValidator = {
      // PrivateKeyInfo
      name: "PrivateKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        // Version (INTEGER)
        name: "PrivateKeyInfo.version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyVersion"
      }, {
        // privateKeyAlgorithm
        name: "PrivateKeyInfo.privateKeyAlgorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "privateKeyOid"
        }]
      }, {
        // PrivateKey
        name: "PrivateKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "privateKey"
      }]
    };
    var rsaPrivateKeyValidator = {
      // RSAPrivateKey
      name: "RSAPrivateKey",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        // Version (INTEGER)
        name: "RSAPrivateKey.version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyVersion"
      }, {
        // modulus (n)
        name: "RSAPrivateKey.modulus",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyModulus"
      }, {
        // publicExponent (e)
        name: "RSAPrivateKey.publicExponent",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyPublicExponent"
      }, {
        // privateExponent (d)
        name: "RSAPrivateKey.privateExponent",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyPrivateExponent"
      }, {
        // prime1 (p)
        name: "RSAPrivateKey.prime1",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyPrime1"
      }, {
        // prime2 (q)
        name: "RSAPrivateKey.prime2",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyPrime2"
      }, {
        // exponent1 (d mod (p-1))
        name: "RSAPrivateKey.exponent1",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyExponent1"
      }, {
        // exponent2 (d mod (q-1))
        name: "RSAPrivateKey.exponent2",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyExponent2"
      }, {
        // coefficient ((inverse of q) mod p)
        name: "RSAPrivateKey.coefficient",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyCoefficient"
      }]
    };
    var rsaPublicKeyValidator = {
      // RSAPublicKey
      name: "RSAPublicKey",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        // modulus (n)
        name: "RSAPublicKey.modulus",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "publicKeyModulus"
      }, {
        // publicExponent (e)
        name: "RSAPublicKey.exponent",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "publicKeyExponent"
      }]
    };
    var publicKeyValidator = forge.pki.rsa.publicKeyValidator = {
      name: "SubjectPublicKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      captureAsn1: "subjectPublicKeyInfo",
      value: [{
        name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "publicKeyOid"
        }]
      }, {
        // subjectPublicKey
        name: "SubjectPublicKeyInfo.subjectPublicKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        value: [{
          // RSAPublicKey
          name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          optional: true,
          captureAsn1: "rsaPublicKey"
        }]
      }]
    };
    var digestInfoValidator = {
      name: "DigestInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "DigestInfo.DigestAlgorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "algorithmIdentifier"
        }, {
          // NULL paramters
          name: "DigestInfo.DigestAlgorithm.parameters",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.NULL,
          // captured only to check existence for md2 and md5
          capture: "parameters",
          optional: true,
          constructed: false
        }]
      }, {
        // digest
        name: "DigestInfo.digest",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "digest"
      }]
    };
    var emsaPkcs1v15encode = function(md) {
      var oid;
      if (md.algorithm in pki.oids) {
        oid = pki.oids[md.algorithm];
      } else {
        var error = new Error("Unknown message digest algorithm.");
        error.algorithm = md.algorithm;
        throw error;
      }
      var oidBytes = asn1.oidToDer(oid).getBytes();
      var digestInfo = asn1.create(
        asn1.Class.UNIVERSAL,
        asn1.Type.SEQUENCE,
        true,
        []
      );
      var digestAlgorithm = asn1.create(
        asn1.Class.UNIVERSAL,
        asn1.Type.SEQUENCE,
        true,
        []
      );
      digestAlgorithm.value.push(asn1.create(
        asn1.Class.UNIVERSAL,
        asn1.Type.OID,
        false,
        oidBytes
      ));
      digestAlgorithm.value.push(asn1.create(
        asn1.Class.UNIVERSAL,
        asn1.Type.NULL,
        false,
        ""
      ));
      var digest2 = asn1.create(
        asn1.Class.UNIVERSAL,
        asn1.Type.OCTETSTRING,
        false,
        md.digest().getBytes()
      );
      digestInfo.value.push(digestAlgorithm);
      digestInfo.value.push(digest2);
      return asn1.toDer(digestInfo).getBytes();
    };
    var _modPow = function(x, key, pub) {
      if (pub) {
        return x.modPow(key.e, key.n);
      }
      if (!key.p || !key.q) {
        return x.modPow(key.d, key.n);
      }
      if (!key.dP) {
        key.dP = key.d.mod(key.p.subtract(BigInteger.ONE));
      }
      if (!key.dQ) {
        key.dQ = key.d.mod(key.q.subtract(BigInteger.ONE));
      }
      if (!key.qInv) {
        key.qInv = key.q.modInverse(key.p);
      }
      var r;
      do {
        r = new BigInteger(
          forge.util.bytesToHex(forge.random.getBytes(key.n.bitLength() / 8)),
          16
        );
      } while (r.compareTo(key.n) >= 0 || !r.gcd(key.n).equals(BigInteger.ONE));
      x = x.multiply(r.modPow(key.e, key.n)).mod(key.n);
      var xp = x.mod(key.p).modPow(key.dP, key.p);
      var xq = x.mod(key.q).modPow(key.dQ, key.q);
      while (xp.compareTo(xq) < 0) {
        xp = xp.add(key.p);
      }
      var y2 = xp.subtract(xq).multiply(key.qInv).mod(key.p).multiply(key.q).add(xq);
      y2 = y2.multiply(r.modInverse(key.n)).mod(key.n);
      return y2;
    };
    pki.rsa.encrypt = function(m, key, bt) {
      var pub = bt;
      var eb;
      var k = Math.ceil(key.n.bitLength() / 8);
      if (bt !== false && bt !== true) {
        pub = bt === 2;
        eb = _encodePkcs1_v1_5(m, key, bt);
      } else {
        eb = forge.util.createBuffer();
        eb.putBytes(m);
      }
      var x = new BigInteger(eb.toHex(), 16);
      var y2 = _modPow(x, key, pub);
      var yhex = y2.toString(16);
      var ed = forge.util.createBuffer();
      var zeros = k - Math.ceil(yhex.length / 2);
      while (zeros > 0) {
        ed.putByte(0);
        --zeros;
      }
      ed.putBytes(forge.util.hexToBytes(yhex));
      return ed.getBytes();
    };
    pki.rsa.decrypt = function(ed, key, pub, ml) {
      var k = Math.ceil(key.n.bitLength() / 8);
      if (ed.length !== k) {
        var error = new Error("Encrypted message length is invalid.");
        error.length = ed.length;
        error.expected = k;
        throw error;
      }
      var y2 = new BigInteger(forge.util.createBuffer(ed).toHex(), 16);
      if (y2.compareTo(key.n) >= 0) {
        throw new Error("Encrypted message is invalid.");
      }
      var x = _modPow(y2, key, pub);
      var xhex = x.toString(16);
      var eb = forge.util.createBuffer();
      var zeros = k - Math.ceil(xhex.length / 2);
      while (zeros > 0) {
        eb.putByte(0);
        --zeros;
      }
      eb.putBytes(forge.util.hexToBytes(xhex));
      if (ml !== false) {
        return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
      }
      return eb.getBytes();
    };
    pki.rsa.createKeyPairGenerationState = function(bits, e2, options) {
      if (typeof bits === "string") {
        bits = parseInt(bits, 10);
      }
      bits = bits || 2048;
      options = options || {};
      var prng = options.prng || forge.random;
      var rng = {
        // x is an array to fill with bytes
        nextBytes: function(x) {
          var b2 = prng.getBytesSync(x.length);
          for (var i = 0; i < x.length; ++i) {
            x[i] = b2.charCodeAt(i);
          }
        }
      };
      var algorithm = options.algorithm || "PRIMEINC";
      var rval;
      if (algorithm === "PRIMEINC") {
        rval = {
          algorithm,
          state: 0,
          bits,
          rng,
          eInt: e2 || 65537,
          e: new BigInteger(null),
          p: null,
          q: null,
          qBits: bits >> 1,
          pBits: bits - (bits >> 1),
          pqState: 0,
          num: null,
          keys: null
        };
        rval.e.fromInt(rval.eInt);
      } else {
        throw new Error("Invalid key generation algorithm: " + algorithm);
      }
      return rval;
    };
    pki.rsa.stepKeyPairGenerationState = function(state, n2) {
      if (!("algorithm" in state)) {
        state.algorithm = "PRIMEINC";
      }
      var THIRTY = new BigInteger(null);
      THIRTY.fromInt(30);
      var deltaIdx = 0;
      var op_or = function(x, y2) {
        return x | y2;
      };
      var t1 = +/* @__PURE__ */ new Date();
      var t2;
      var total = 0;
      while (state.keys === null && (n2 <= 0 || total < n2)) {
        if (state.state === 0) {
          var bits = state.p === null ? state.pBits : state.qBits;
          var bits1 = bits - 1;
          if (state.pqState === 0) {
            state.num = new BigInteger(bits, state.rng);
            if (!state.num.testBit(bits1)) {
              state.num.bitwiseTo(
                BigInteger.ONE.shiftLeft(bits1),
                op_or,
                state.num
              );
            }
            state.num.dAddOffset(31 - state.num.mod(THIRTY).byteValue(), 0);
            deltaIdx = 0;
            ++state.pqState;
          } else if (state.pqState === 1) {
            if (state.num.bitLength() > bits) {
              state.pqState = 0;
            } else if (state.num.isProbablePrime(
              _getMillerRabinTests(state.num.bitLength())
            )) {
              ++state.pqState;
            } else {
              state.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
            }
          } else if (state.pqState === 2) {
            state.pqState = state.num.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) === 0 ? 3 : 0;
          } else if (state.pqState === 3) {
            state.pqState = 0;
            if (state.p === null) {
              state.p = state.num;
            } else {
              state.q = state.num;
            }
            if (state.p !== null && state.q !== null) {
              ++state.state;
            }
            state.num = null;
          }
        } else if (state.state === 1) {
          if (state.p.compareTo(state.q) < 0) {
            state.num = state.p;
            state.p = state.q;
            state.q = state.num;
          }
          ++state.state;
        } else if (state.state === 2) {
          state.p1 = state.p.subtract(BigInteger.ONE);
          state.q1 = state.q.subtract(BigInteger.ONE);
          state.phi = state.p1.multiply(state.q1);
          ++state.state;
        } else if (state.state === 3) {
          if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) === 0) {
            ++state.state;
          } else {
            state.p = null;
            state.q = null;
            state.state = 0;
          }
        } else if (state.state === 4) {
          state.n = state.p.multiply(state.q);
          if (state.n.bitLength() === state.bits) {
            ++state.state;
          } else {
            state.q = null;
            state.state = 0;
          }
        } else if (state.state === 5) {
          var d2 = state.e.modInverse(state.phi);
          state.keys = {
            privateKey: pki.rsa.setPrivateKey(
              state.n,
              state.e,
              d2,
              state.p,
              state.q,
              d2.mod(state.p1),
              d2.mod(state.q1),
              state.q.modInverse(state.p)
            ),
            publicKey: pki.rsa.setPublicKey(state.n, state.e)
          };
        }
        t2 = +/* @__PURE__ */ new Date();
        total += t2 - t1;
        t1 = t2;
      }
      return state.keys !== null;
    };
    pki.rsa.generateKeyPair = function(bits, e2, options, callback) {
      if (arguments.length === 1) {
        if (typeof bits === "object") {
          options = bits;
          bits = void 0;
        } else if (typeof bits === "function") {
          callback = bits;
          bits = void 0;
        }
      } else if (arguments.length === 2) {
        if (typeof bits === "number") {
          if (typeof e2 === "function") {
            callback = e2;
            e2 = void 0;
          } else if (typeof e2 !== "number") {
            options = e2;
            e2 = void 0;
          }
        } else {
          options = bits;
          callback = e2;
          bits = void 0;
          e2 = void 0;
        }
      } else if (arguments.length === 3) {
        if (typeof e2 === "number") {
          if (typeof options === "function") {
            callback = options;
            options = void 0;
          }
        } else {
          callback = options;
          options = e2;
          e2 = void 0;
        }
      }
      options = options || {};
      if (bits === void 0) {
        bits = options.bits || 2048;
      }
      if (e2 === void 0) {
        e2 = options.e || 65537;
      }
      if (!forge.options.usePureJavaScript && !options.prng && bits >= 256 && bits <= 16384 && (e2 === 65537 || e2 === 3)) {
        if (callback) {
          if (_detectNodeCrypto("generateKeyPair")) {
            return _crypto.generateKeyPair("rsa", {
              modulusLength: bits,
              publicExponent: e2,
              publicKeyEncoding: {
                type: "spki",
                format: "pem"
              },
              privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
              }
            }, function(err, pub, priv) {
              if (err) {
                return callback(err);
              }
              callback(null, {
                privateKey: pki.privateKeyFromPem(priv),
                publicKey: pki.publicKeyFromPem(pub)
              });
            });
          }
          if (_detectSubtleCrypto("generateKey") && _detectSubtleCrypto("exportKey")) {
            return util.globalScope.crypto.subtle.generateKey({
              name: "RSASSA-PKCS1-v1_5",
              modulusLength: bits,
              publicExponent: _intToUint8Array(e2),
              hash: { name: "SHA-256" }
            }, true, ["sign", "verify"]).then(function(pair) {
              return util.globalScope.crypto.subtle.exportKey(
                "pkcs8",
                pair.privateKey
              );
            }).then(void 0, function(err) {
              callback(err);
            }).then(function(pkcs8) {
              if (pkcs8) {
                var privateKey = pki.privateKeyFromAsn1(
                  asn1.fromDer(forge.util.createBuffer(pkcs8))
                );
                callback(null, {
                  privateKey,
                  publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
                });
              }
            });
          }
          if (_detectSubtleMsCrypto("generateKey") && _detectSubtleMsCrypto("exportKey")) {
            var genOp = util.globalScope.msCrypto.subtle.generateKey({
              name: "RSASSA-PKCS1-v1_5",
              modulusLength: bits,
              publicExponent: _intToUint8Array(e2),
              hash: { name: "SHA-256" }
            }, true, ["sign", "verify"]);
            genOp.oncomplete = function(e3) {
              var pair = e3.target.result;
              var exportOp = util.globalScope.msCrypto.subtle.exportKey(
                "pkcs8",
                pair.privateKey
              );
              exportOp.oncomplete = function(e4) {
                var pkcs8 = e4.target.result;
                var privateKey = pki.privateKeyFromAsn1(
                  asn1.fromDer(forge.util.createBuffer(pkcs8))
                );
                callback(null, {
                  privateKey,
                  publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
                });
              };
              exportOp.onerror = function(err) {
                callback(err);
              };
            };
            genOp.onerror = function(err) {
              callback(err);
            };
            return;
          }
        } else {
          if (_detectNodeCrypto("generateKeyPairSync")) {
            var keypair = _crypto.generateKeyPairSync("rsa", {
              modulusLength: bits,
              publicExponent: e2,
              publicKeyEncoding: {
                type: "spki",
                format: "pem"
              },
              privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
              }
            });
            return {
              privateKey: pki.privateKeyFromPem(keypair.privateKey),
              publicKey: pki.publicKeyFromPem(keypair.publicKey)
            };
          }
        }
      }
      var state = pki.rsa.createKeyPairGenerationState(bits, e2, options);
      if (!callback) {
        pki.rsa.stepKeyPairGenerationState(state, 0);
        return state.keys;
      }
      _generateKeyPair(state, options, callback);
    };
    pki.setRsaPublicKey = pki.rsa.setPublicKey = function(n2, e2) {
      var key = {
        n: n2,
        e: e2
      };
      key.encrypt = function(data, scheme, schemeOptions) {
        if (typeof scheme === "string") {
          scheme = scheme.toUpperCase();
        } else if (scheme === void 0) {
          scheme = "RSAES-PKCS1-V1_5";
        }
        if (scheme === "RSAES-PKCS1-V1_5") {
          scheme = {
            encode: function(m, key2, pub) {
              return _encodePkcs1_v1_5(m, key2, 2).getBytes();
            }
          };
        } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
          scheme = {
            encode: function(m, key2) {
              return forge.pkcs1.encode_rsa_oaep(key2, m, schemeOptions);
            }
          };
        } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
          scheme = { encode: function(e4) {
            return e4;
          } };
        } else if (typeof scheme === "string") {
          throw new Error('Unsupported encryption scheme: "' + scheme + '".');
        }
        var e3 = scheme.encode(data, key, true);
        return pki.rsa.encrypt(e3, key, true);
      };
      key.verify = function(digest2, signature, scheme, options) {
        if (typeof scheme === "string") {
          scheme = scheme.toUpperCase();
        } else if (scheme === void 0) {
          scheme = "RSASSA-PKCS1-V1_5";
        }
        if (options === void 0) {
          options = {
            _parseAllDigestBytes: true
          };
        }
        if (!("_parseAllDigestBytes" in options)) {
          options._parseAllDigestBytes = true;
        }
        if (scheme === "RSASSA-PKCS1-V1_5") {
          scheme = {
            verify: function(digest3, d3) {
              d3 = _decodePkcs1_v1_5(d3, key, true);
              var obj = asn1.fromDer(d3, {
                parseAllBytes: options._parseAllDigestBytes
              });
              var capture = {};
              var errors = [];
              if (!asn1.validate(obj, digestInfoValidator, capture, errors)) {
                var error = new Error(
                  "ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value."
                );
                error.errors = errors;
                throw error;
              }
              var oid = asn1.derToOid(capture.algorithmIdentifier);
              if (!(oid === forge.oids.md2 || oid === forge.oids.md5 || oid === forge.oids.sha1 || oid === forge.oids.sha224 || oid === forge.oids.sha256 || oid === forge.oids.sha384 || oid === forge.oids.sha512 || oid === forge.oids["sha512-224"] || oid === forge.oids["sha512-256"])) {
                var error = new Error(
                  "Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier."
                );
                error.oid = oid;
                throw error;
              }
              if (oid === forge.oids.md2 || oid === forge.oids.md5) {
                if (!("parameters" in capture)) {
                  throw new Error(
                    "ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters."
                  );
                }
              }
              return digest3 === capture.digest;
            }
          };
        } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
          scheme = {
            verify: function(digest3, d3) {
              d3 = _decodePkcs1_v1_5(d3, key, true);
              return digest3 === d3;
            }
          };
        }
        var d2 = pki.rsa.decrypt(signature, key, true, false);
        return scheme.verify(digest2, d2, key.n.bitLength());
      };
      return key;
    };
    pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(n2, e2, d2, p2, q2, dP, dQ, qInv) {
      var key = {
        n: n2,
        e: e2,
        d: d2,
        p: p2,
        q: q2,
        dP,
        dQ,
        qInv
      };
      key.decrypt = function(data, scheme, schemeOptions) {
        if (typeof scheme === "string") {
          scheme = scheme.toUpperCase();
        } else if (scheme === void 0) {
          scheme = "RSAES-PKCS1-V1_5";
        }
        var d3 = pki.rsa.decrypt(data, key, false, false);
        if (scheme === "RSAES-PKCS1-V1_5") {
          scheme = { decode: _decodePkcs1_v1_5 };
        } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
          scheme = {
            decode: function(d4, key2) {
              return forge.pkcs1.decode_rsa_oaep(key2, d4, schemeOptions);
            }
          };
        } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
          scheme = { decode: function(d4) {
            return d4;
          } };
        } else {
          throw new Error('Unsupported encryption scheme: "' + scheme + '".');
        }
        return scheme.decode(d3, key, false);
      };
      key.sign = function(md, scheme) {
        var bt = false;
        if (typeof scheme === "string") {
          scheme = scheme.toUpperCase();
        }
        if (scheme === void 0 || scheme === "RSASSA-PKCS1-V1_5") {
          scheme = { encode: emsaPkcs1v15encode };
          bt = 1;
        } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
          scheme = { encode: function() {
            return md;
          } };
          bt = 1;
        }
        var d3 = scheme.encode(md, key.n.bitLength());
        return pki.rsa.encrypt(d3, key, bt);
      };
      return key;
    };
    pki.wrapRsaPrivateKey = function(rsaKey) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // version (0)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          asn1.integerToDer(0).getBytes()
        ),
        // privateKeyAlgorithm
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OID,
            false,
            asn1.oidToDer(pki.oids.rsaEncryption).getBytes()
          ),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
        ]),
        // PrivateKey
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OCTETSTRING,
          false,
          asn1.toDer(rsaKey).getBytes()
        )
      ]);
    };
    pki.privateKeyFromAsn1 = function(obj) {
      var capture = {};
      var errors = [];
      if (asn1.validate(obj, privateKeyValidator, capture, errors)) {
        obj = asn1.fromDer(forge.util.createBuffer(capture.privateKey));
      }
      capture = {};
      errors = [];
      if (!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors)) {
        var error = new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
        error.errors = errors;
        throw error;
      }
      var n2, e2, d2, p2, q2, dP, dQ, qInv;
      n2 = forge.util.createBuffer(capture.privateKeyModulus).toHex();
      e2 = forge.util.createBuffer(capture.privateKeyPublicExponent).toHex();
      d2 = forge.util.createBuffer(capture.privateKeyPrivateExponent).toHex();
      p2 = forge.util.createBuffer(capture.privateKeyPrime1).toHex();
      q2 = forge.util.createBuffer(capture.privateKeyPrime2).toHex();
      dP = forge.util.createBuffer(capture.privateKeyExponent1).toHex();
      dQ = forge.util.createBuffer(capture.privateKeyExponent2).toHex();
      qInv = forge.util.createBuffer(capture.privateKeyCoefficient).toHex();
      return pki.setRsaPrivateKey(
        new BigInteger(n2, 16),
        new BigInteger(e2, 16),
        new BigInteger(d2, 16),
        new BigInteger(p2, 16),
        new BigInteger(q2, 16),
        new BigInteger(dP, 16),
        new BigInteger(dQ, 16),
        new BigInteger(qInv, 16)
      );
    };
    pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // version (0 = only 2 primes, 1 multiple primes)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          asn1.integerToDer(0).getBytes()
        ),
        // modulus (n)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.n)
        ),
        // publicExponent (e)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.e)
        ),
        // privateExponent (d)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.d)
        ),
        // privateKeyPrime1 (p)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.p)
        ),
        // privateKeyPrime2 (q)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.q)
        ),
        // privateKeyExponent1 (dP)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.dP)
        ),
        // privateKeyExponent2 (dQ)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.dQ)
        ),
        // coefficient (qInv)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.qInv)
        )
      ]);
    };
    pki.publicKeyFromAsn1 = function(obj) {
      var capture = {};
      var errors = [];
      if (asn1.validate(obj, publicKeyValidator, capture, errors)) {
        var oid = asn1.derToOid(capture.publicKeyOid);
        if (oid !== pki.oids.rsaEncryption) {
          var error = new Error("Cannot read public key. Unknown OID.");
          error.oid = oid;
          throw error;
        }
        obj = capture.rsaPublicKey;
      }
      errors = [];
      if (!asn1.validate(obj, rsaPublicKeyValidator, capture, errors)) {
        var error = new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
        error.errors = errors;
        throw error;
      }
      var n2 = forge.util.createBuffer(capture.publicKeyModulus).toHex();
      var e2 = forge.util.createBuffer(capture.publicKeyExponent).toHex();
      return pki.setRsaPublicKey(
        new BigInteger(n2, 16),
        new BigInteger(e2, 16)
      );
    };
    pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // AlgorithmIdentifier
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // algorithm
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OID,
            false,
            asn1.oidToDer(pki.oids.rsaEncryption).getBytes()
          ),
          // parameters (null)
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
        ]),
        // subjectPublicKey
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [
          pki.publicKeyToRSAPublicKey(key)
        ])
      ]);
    };
    pki.publicKeyToRSAPublicKey = function(key) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // modulus (n)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.n)
        ),
        // publicExponent (e)
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          _bnToBytes(key.e)
        )
      ]);
    };
    function _encodePkcs1_v1_5(m, key, bt) {
      var eb = forge.util.createBuffer();
      var k = Math.ceil(key.n.bitLength() / 8);
      if (m.length > k - 11) {
        var error = new Error("Message is too long for PKCS#1 v1.5 padding.");
        error.length = m.length;
        error.max = k - 11;
        throw error;
      }
      eb.putByte(0);
      eb.putByte(bt);
      var padNum = k - 3 - m.length;
      var padByte;
      if (bt === 0 || bt === 1) {
        padByte = bt === 0 ? 0 : 255;
        for (var i = 0; i < padNum; ++i) {
          eb.putByte(padByte);
        }
      } else {
        while (padNum > 0) {
          var numZeros = 0;
          var padBytes = forge.random.getBytes(padNum);
          for (var i = 0; i < padNum; ++i) {
            padByte = padBytes.charCodeAt(i);
            if (padByte === 0) {
              ++numZeros;
            } else {
              eb.putByte(padByte);
            }
          }
          padNum = numZeros;
        }
      }
      eb.putByte(0);
      eb.putBytes(m);
      return eb;
    }
    function _decodePkcs1_v1_5(em, key, pub, ml) {
      var k = Math.ceil(key.n.bitLength() / 8);
      var eb = forge.util.createBuffer(em);
      var first = eb.getByte();
      var bt = eb.getByte();
      if (first !== 0 || pub && bt !== 0 && bt !== 1 || !pub && bt != 2 || pub && bt === 0 && typeof ml === "undefined") {
        throw new Error("Encryption block is invalid.");
      }
      var padNum = 0;
      if (bt === 0) {
        padNum = k - 3 - ml;
        for (var i = 0; i < padNum; ++i) {
          if (eb.getByte() !== 0) {
            throw new Error("Encryption block is invalid.");
          }
        }
      } else if (bt === 1) {
        padNum = 0;
        while (eb.length() > 1) {
          if (eb.getByte() !== 255) {
            --eb.read;
            break;
          }
          ++padNum;
        }
      } else if (bt === 2) {
        padNum = 0;
        while (eb.length() > 1) {
          if (eb.getByte() === 0) {
            --eb.read;
            break;
          }
          ++padNum;
        }
      }
      var zero = eb.getByte();
      if (zero !== 0 || padNum !== k - 3 - eb.length()) {
        throw new Error("Encryption block is invalid.");
      }
      return eb.getBytes();
    }
    function _generateKeyPair(state, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options = options || {};
      var opts = {
        algorithm: {
          name: options.algorithm || "PRIMEINC",
          options: {
            workers: options.workers || 2,
            workLoad: options.workLoad || 100,
            workerScript: options.workerScript
          }
        }
      };
      if ("prng" in options) {
        opts.prng = options.prng;
      }
      generate();
      function generate() {
        getPrime(state.pBits, function(err, num) {
          if (err) {
            return callback(err);
          }
          state.p = num;
          if (state.q !== null) {
            return finish(err, state.q);
          }
          getPrime(state.qBits, finish);
        });
      }
      function getPrime(bits, callback2) {
        forge.prime.generateProbablePrime(bits, opts, callback2);
      }
      function finish(err, num) {
        if (err) {
          return callback(err);
        }
        state.q = num;
        if (state.p.compareTo(state.q) < 0) {
          var tmp = state.p;
          state.p = state.q;
          state.q = tmp;
        }
        if (state.p.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
          state.p = null;
          generate();
          return;
        }
        if (state.q.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
          state.q = null;
          getPrime(state.qBits, finish);
          return;
        }
        state.p1 = state.p.subtract(BigInteger.ONE);
        state.q1 = state.q.subtract(BigInteger.ONE);
        state.phi = state.p1.multiply(state.q1);
        if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
          state.p = state.q = null;
          generate();
          return;
        }
        state.n = state.p.multiply(state.q);
        if (state.n.bitLength() !== state.bits) {
          state.q = null;
          getPrime(state.qBits, finish);
          return;
        }
        var d2 = state.e.modInverse(state.phi);
        state.keys = {
          privateKey: pki.rsa.setPrivateKey(
            state.n,
            state.e,
            d2,
            state.p,
            state.q,
            d2.mod(state.p1),
            d2.mod(state.q1),
            state.q.modInverse(state.p)
          ),
          publicKey: pki.rsa.setPublicKey(state.n, state.e)
        };
        callback(null, state.keys);
      }
    }
    function _bnToBytes(b2) {
      var hex = b2.toString(16);
      if (hex[0] >= "8") {
        hex = "00" + hex;
      }
      var bytes = forge.util.hexToBytes(hex);
      if (bytes.length > 1 && // leading 0x00 for positive integer
      (bytes.charCodeAt(0) === 0 && (bytes.charCodeAt(1) & 128) === 0 || // leading 0xFF for negative integer
      bytes.charCodeAt(0) === 255 && (bytes.charCodeAt(1) & 128) === 128)) {
        return bytes.substr(1);
      }
      return bytes;
    }
    function _getMillerRabinTests(bits) {
      if (bits <= 100) return 27;
      if (bits <= 150) return 18;
      if (bits <= 200) return 15;
      if (bits <= 250) return 12;
      if (bits <= 300) return 9;
      if (bits <= 350) return 8;
      if (bits <= 400) return 7;
      if (bits <= 500) return 6;
      if (bits <= 600) return 5;
      if (bits <= 800) return 4;
      if (bits <= 1250) return 3;
      return 2;
    }
    function _detectNodeCrypto(fn) {
      return forge.util.isNodejs && typeof _crypto[fn] === "function";
    }
    function _detectSubtleCrypto(fn) {
      return typeof util.globalScope !== "undefined" && typeof util.globalScope.crypto === "object" && typeof util.globalScope.crypto.subtle === "object" && typeof util.globalScope.crypto.subtle[fn] === "function";
    }
    function _detectSubtleMsCrypto(fn) {
      return typeof util.globalScope !== "undefined" && typeof util.globalScope.msCrypto === "object" && typeof util.globalScope.msCrypto.subtle === "object" && typeof util.globalScope.msCrypto.subtle[fn] === "function";
    }
    function _intToUint8Array(x) {
      var bytes = forge.util.hexToBytes(x.toString(16));
      var buffer2 = new Uint8Array(bytes.length);
      for (var i = 0; i < bytes.length; ++i) {
        buffer2[i] = bytes.charCodeAt(i);
      }
      return buffer2;
    }
  }
});

// node_modules/node-forge/lib/pbe.js
var require_pbe = __commonJS({
  "node_modules/node-forge/lib/pbe.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_aes();
    require_asn1();
    require_des();
    require_md();
    require_oids();
    require_pbkdf2();
    require_pem();
    require_random();
    require_rc2();
    require_rsa();
    require_util();
    if (typeof BigInteger === "undefined") {
      BigInteger = forge.jsbn.BigInteger;
    }
    var BigInteger;
    var asn1 = forge.asn1;
    var pki = forge.pki = forge.pki || {};
    module2.exports = pki.pbe = forge.pbe = forge.pbe || {};
    var oids = pki.oids;
    var encryptedPrivateKeyValidator = {
      name: "EncryptedPrivateKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "encryptionOid"
        }, {
          name: "AlgorithmIdentifier.parameters",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: "encryptionParams"
        }]
      }, {
        // encryptedData
        name: "EncryptedPrivateKeyInfo.encryptedData",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "encryptedData"
      }]
    };
    var PBES2AlgorithmsValidator = {
      name: "PBES2Algorithms",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "PBES2Algorithms.keyDerivationFunc",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "PBES2Algorithms.keyDerivationFunc.oid",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "kdfOid"
        }, {
          name: "PBES2Algorithms.params",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "PBES2Algorithms.params.salt",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: false,
            capture: "kdfSalt"
          }, {
            name: "PBES2Algorithms.params.iterationCount",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "kdfIterationCount"
          }, {
            name: "PBES2Algorithms.params.keyLength",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            optional: true,
            capture: "keyLength"
          }, {
            // prf
            name: "PBES2Algorithms.params.prf",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            optional: true,
            value: [{
              name: "PBES2Algorithms.params.prf.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: "prfOid"
            }]
          }]
        }]
      }, {
        name: "PBES2Algorithms.encryptionScheme",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "PBES2Algorithms.encryptionScheme.oid",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "encOid"
        }, {
          name: "PBES2Algorithms.encryptionScheme.iv",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "encIv"
        }]
      }]
    };
    var pkcs12PbeParamsValidator = {
      name: "pkcs-12PbeParams",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "pkcs-12PbeParams.salt",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "salt"
      }, {
        name: "pkcs-12PbeParams.iterations",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "iterations"
      }]
    };
    pki.encryptPrivateKeyInfo = function(obj, password, options) {
      options = options || {};
      options.saltSize = options.saltSize || 8;
      options.count = options.count || 2048;
      options.algorithm = options.algorithm || "aes128";
      options.prfAlgorithm = options.prfAlgorithm || "sha1";
      var salt = forge.random.getBytesSync(options.saltSize);
      var count = options.count;
      var countBytes = asn1.integerToDer(count);
      var dkLen;
      var encryptionAlgorithm;
      var encryptedData;
      if (options.algorithm.indexOf("aes") === 0 || options.algorithm === "des") {
        var ivLen, encOid, cipherFn;
        switch (options.algorithm) {
          case "aes128":
            dkLen = 16;
            ivLen = 16;
            encOid = oids["aes128-CBC"];
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case "aes192":
            dkLen = 24;
            ivLen = 16;
            encOid = oids["aes192-CBC"];
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case "aes256":
            dkLen = 32;
            ivLen = 16;
            encOid = oids["aes256-CBC"];
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case "des":
            dkLen = 8;
            ivLen = 8;
            encOid = oids["desCBC"];
            cipherFn = forge.des.createEncryptionCipher;
            break;
          default:
            var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
            error.algorithm = options.algorithm;
            throw error;
        }
        var prfAlgorithm = "hmacWith" + options.prfAlgorithm.toUpperCase();
        var md = prfAlgorithmToMessageDigest(prfAlgorithm);
        var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
        var iv = forge.random.getBytesSync(ivLen);
        var cipher = cipherFn(dk);
        cipher.start(iv);
        cipher.update(asn1.toDer(obj));
        cipher.finish();
        encryptedData = cipher.output.getBytes();
        var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);
        encryptionAlgorithm = asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.SEQUENCE,
          true,
          [
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(oids["pkcs5PBES2"]).getBytes()
            ),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // keyDerivationFunc
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OID,
                  false,
                  asn1.oidToDer(oids["pkcs5PBKDF2"]).getBytes()
                ),
                // PBKDF2-params
                params
              ]),
              // encryptionScheme
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OID,
                  false,
                  asn1.oidToDer(encOid).getBytes()
                ),
                // iv
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OCTETSTRING,
                  false,
                  iv
                )
              ])
            ])
          ]
        );
      } else if (options.algorithm === "3des") {
        dkLen = 24;
        var saltBytes = new forge.util.ByteBuffer(salt);
        var dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
        var iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
        var cipher = forge.des.createEncryptionCipher(dk);
        cipher.start(iv);
        cipher.update(asn1.toDer(obj));
        cipher.finish();
        encryptedData = cipher.output.getBytes();
        encryptionAlgorithm = asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.SEQUENCE,
          true,
          [
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()
            ),
            // pkcs-12PbeParams
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // salt
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
              // iteration count
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.INTEGER,
                false,
                countBytes.getBytes()
              )
            ])
          ]
        );
      } else {
        var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
        error.algorithm = options.algorithm;
        throw error;
      }
      var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // encryptionAlgorithm
        encryptionAlgorithm,
        // encryptedData
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OCTETSTRING,
          false,
          encryptedData
        )
      ]);
      return rval;
    };
    pki.decryptPrivateKeyInfo = function(obj, password) {
      var rval = null;
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors)) {
        var error = new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
        error.errors = errors;
        throw error;
      }
      var oid = asn1.derToOid(capture.encryptionOid);
      var cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password);
      var encrypted = forge.util.createBuffer(capture.encryptedData);
      cipher.update(encrypted);
      if (cipher.finish()) {
        rval = asn1.fromDer(cipher.output);
      }
      return rval;
    };
    pki.encryptedPrivateKeyToPem = function(epki, maxline) {
      var msg = {
        type: "ENCRYPTED PRIVATE KEY",
        body: asn1.toDer(epki).getBytes()
      };
      return forge.pem.encode(msg, { maxline });
    };
    pki.encryptedPrivateKeyFromPem = function(pem) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== "ENCRYPTED PRIVATE KEY") {
        var error = new Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
        error.headerType = msg.type;
        throw error;
      }
      if (msg.procType && msg.procType.type === "ENCRYPTED") {
        throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
      }
      return asn1.fromDer(msg.body);
    };
    pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
      options = options || {};
      if (!options.legacy) {
        var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
        rval = pki.encryptPrivateKeyInfo(rval, password, options);
        return pki.encryptedPrivateKeyToPem(rval);
      }
      var algorithm;
      var iv;
      var dkLen;
      var cipherFn;
      switch (options.algorithm) {
        case "aes128":
          algorithm = "AES-128-CBC";
          dkLen = 16;
          iv = forge.random.getBytesSync(16);
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "aes192":
          algorithm = "AES-192-CBC";
          dkLen = 24;
          iv = forge.random.getBytesSync(16);
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "aes256":
          algorithm = "AES-256-CBC";
          dkLen = 32;
          iv = forge.random.getBytesSync(16);
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "3des":
          algorithm = "DES-EDE3-CBC";
          dkLen = 24;
          iv = forge.random.getBytesSync(8);
          cipherFn = forge.des.createEncryptionCipher;
          break;
        case "des":
          algorithm = "DES-CBC";
          dkLen = 8;
          iv = forge.random.getBytesSync(8);
          cipherFn = forge.des.createEncryptionCipher;
          break;
        default:
          var error = new Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + options.algorithm + '".');
          error.algorithm = options.algorithm;
          throw error;
      }
      var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
      var cipher = cipherFn(dk);
      cipher.start(iv);
      cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey)));
      cipher.finish();
      var msg = {
        type: "RSA PRIVATE KEY",
        procType: {
          version: "4",
          type: "ENCRYPTED"
        },
        dekInfo: {
          algorithm,
          parameters: forge.util.bytesToHex(iv).toUpperCase()
        },
        body: cipher.output.getBytes()
      };
      return forge.pem.encode(msg);
    };
    pki.decryptRsaPrivateKey = function(pem, password) {
      var rval = null;
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== "ENCRYPTED PRIVATE KEY" && msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
        var error = new Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
        error.headerType = error;
        throw error;
      }
      if (msg.procType && msg.procType.type === "ENCRYPTED") {
        var dkLen;
        var cipherFn;
        switch (msg.dekInfo.algorithm) {
          case "DES-CBC":
            dkLen = 8;
            cipherFn = forge.des.createDecryptionCipher;
            break;
          case "DES-EDE3-CBC":
            dkLen = 24;
            cipherFn = forge.des.createDecryptionCipher;
            break;
          case "AES-128-CBC":
            dkLen = 16;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case "AES-192-CBC":
            dkLen = 24;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case "AES-256-CBC":
            dkLen = 32;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case "RC2-40-CBC":
            dkLen = 5;
            cipherFn = function(key) {
              return forge.rc2.createDecryptionCipher(key, 40);
            };
            break;
          case "RC2-64-CBC":
            dkLen = 8;
            cipherFn = function(key) {
              return forge.rc2.createDecryptionCipher(key, 64);
            };
            break;
          case "RC2-128-CBC":
            dkLen = 16;
            cipherFn = function(key) {
              return forge.rc2.createDecryptionCipher(key, 128);
            };
            break;
          default:
            var error = new Error('Could not decrypt private key; unsupported encryption algorithm "' + msg.dekInfo.algorithm + '".');
            error.algorithm = msg.dekInfo.algorithm;
            throw error;
        }
        var iv = forge.util.hexToBytes(msg.dekInfo.parameters);
        var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
        var cipher = cipherFn(dk);
        cipher.start(iv);
        cipher.update(forge.util.createBuffer(msg.body));
        if (cipher.finish()) {
          rval = cipher.output.getBytes();
        } else {
          return rval;
        }
      } else {
        rval = msg.body;
      }
      if (msg.type === "ENCRYPTED PRIVATE KEY") {
        rval = pki.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
      } else {
        rval = asn1.fromDer(rval);
      }
      if (rval !== null) {
        rval = pki.privateKeyFromAsn1(rval);
      }
      return rval;
    };
    pki.pbe.generatePkcs12Key = function(password, salt, id, iter, n2, md) {
      var j, l2;
      if (typeof md === "undefined" || md === null) {
        if (!("sha1" in forge.md)) {
          throw new Error('"sha1" hash algorithm unavailable.');
        }
        md = forge.md.sha1.create();
      }
      var u = md.digestLength;
      var v2 = md.blockLength;
      var result = new forge.util.ByteBuffer();
      var passBuf = new forge.util.ByteBuffer();
      if (password !== null && password !== void 0) {
        for (l2 = 0; l2 < password.length; l2++) {
          passBuf.putInt16(password.charCodeAt(l2));
        }
        passBuf.putInt16(0);
      }
      var p2 = passBuf.length();
      var s = salt.length();
      var D = new forge.util.ByteBuffer();
      D.fillWithByte(id, v2);
      var Slen = v2 * Math.ceil(s / v2);
      var S2 = new forge.util.ByteBuffer();
      for (l2 = 0; l2 < Slen; l2++) {
        S2.putByte(salt.at(l2 % s));
      }
      var Plen = v2 * Math.ceil(p2 / v2);
      var P = new forge.util.ByteBuffer();
      for (l2 = 0; l2 < Plen; l2++) {
        P.putByte(passBuf.at(l2 % p2));
      }
      var I = S2;
      I.putBuffer(P);
      var c = Math.ceil(n2 / u);
      for (var i = 1; i <= c; i++) {
        var buf2 = new forge.util.ByteBuffer();
        buf2.putBytes(D.bytes());
        buf2.putBytes(I.bytes());
        for (var round = 0; round < iter; round++) {
          md.start();
          md.update(buf2.getBytes());
          buf2 = md.digest();
        }
        var B = new forge.util.ByteBuffer();
        for (l2 = 0; l2 < v2; l2++) {
          B.putByte(buf2.at(l2 % u));
        }
        var k = Math.ceil(s / v2) + Math.ceil(p2 / v2);
        var Inew = new forge.util.ByteBuffer();
        for (j = 0; j < k; j++) {
          var chunk = new forge.util.ByteBuffer(I.getBytes(v2));
          var x = 511;
          for (l2 = B.length() - 1; l2 >= 0; l2--) {
            x = x >> 8;
            x += B.at(l2) + chunk.at(l2);
            chunk.setAt(l2, x & 255);
          }
          Inew.putBuffer(chunk);
        }
        I = Inew;
        result.putBuffer(buf2);
      }
      result.truncate(result.length() - n2);
      return result;
    };
    pki.pbe.getCipher = function(oid, params, password) {
      switch (oid) {
        case pki.oids["pkcs5PBES2"]:
          return pki.pbe.getCipherForPBES2(oid, params, password);
        case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
        case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
          return pki.pbe.getCipherForPKCS12PBE(oid, params, password);
        default:
          var error = new Error("Cannot read encrypted PBE data block. Unsupported OID.");
          error.oid = oid;
          error.supportedOids = [
            "pkcs5PBES2",
            "pbeWithSHAAnd3-KeyTripleDES-CBC",
            "pbewithSHAAnd40BitRC2-CBC"
          ];
          throw error;
      }
    };
    pki.pbe.getCipherForPBES2 = function(oid, params, password) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors)) {
        var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
        error.errors = errors;
        throw error;
      }
      oid = asn1.derToOid(capture.kdfOid);
      if (oid !== pki.oids["pkcs5PBKDF2"]) {
        var error = new Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
        error.oid = oid;
        error.supportedOids = ["pkcs5PBKDF2"];
        throw error;
      }
      oid = asn1.derToOid(capture.encOid);
      if (oid !== pki.oids["aes128-CBC"] && oid !== pki.oids["aes192-CBC"] && oid !== pki.oids["aes256-CBC"] && oid !== pki.oids["des-EDE3-CBC"] && oid !== pki.oids["desCBC"]) {
        var error = new Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
        error.oid = oid;
        error.supportedOids = [
          "aes128-CBC",
          "aes192-CBC",
          "aes256-CBC",
          "des-EDE3-CBC",
          "desCBC"
        ];
        throw error;
      }
      var salt = capture.kdfSalt;
      var count = forge.util.createBuffer(capture.kdfIterationCount);
      count = count.getInt(count.length() << 3);
      var dkLen;
      var cipherFn;
      switch (pki.oids[oid]) {
        case "aes128-CBC":
          dkLen = 16;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "aes192-CBC":
          dkLen = 24;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "aes256-CBC":
          dkLen = 32;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "des-EDE3-CBC":
          dkLen = 24;
          cipherFn = forge.des.createDecryptionCipher;
          break;
        case "desCBC":
          dkLen = 8;
          cipherFn = forge.des.createDecryptionCipher;
          break;
      }
      var md = prfOidToMessageDigest(capture.prfOid);
      var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
      var iv = capture.encIv;
      var cipher = cipherFn(dk);
      cipher.start(iv);
      return cipher;
    };
    pki.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors)) {
        var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
        error.errors = errors;
        throw error;
      }
      var salt = forge.util.createBuffer(capture.salt);
      var count = forge.util.createBuffer(capture.iterations);
      count = count.getInt(count.length() << 3);
      var dkLen, dIvLen, cipherFn;
      switch (oid) {
        case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
          dkLen = 24;
          dIvLen = 8;
          cipherFn = forge.des.startDecrypting;
          break;
        case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
          dkLen = 5;
          dIvLen = 8;
          cipherFn = function(key2, iv2) {
            var cipher = forge.rc2.createDecryptionCipher(key2, 40);
            cipher.start(iv2, null);
            return cipher;
          };
          break;
        default:
          var error = new Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
          error.oid = oid;
          throw error;
      }
      var md = prfOidToMessageDigest(capture.prfOid);
      var key = pki.pbe.generatePkcs12Key(password, salt, 1, count, dkLen, md);
      md.start();
      var iv = pki.pbe.generatePkcs12Key(password, salt, 2, count, dIvLen, md);
      return cipherFn(key, iv);
    };
    pki.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
      if (typeof md === "undefined" || md === null) {
        if (!("md5" in forge.md)) {
          throw new Error('"md5" hash algorithm unavailable.');
        }
        md = forge.md.md5.create();
      }
      if (salt === null) {
        salt = "";
      }
      var digests = [hash(md, password + salt)];
      for (var length2 = 16, i = 1; length2 < dkLen; ++i, length2 += 16) {
        digests.push(hash(md, digests[i - 1] + password + salt));
      }
      return digests.join("").substr(0, dkLen);
    };
    function hash(md, bytes) {
      return md.start().update(bytes).digest().getBytes();
    }
    function prfOidToMessageDigest(prfOid) {
      var prfAlgorithm;
      if (!prfOid) {
        prfAlgorithm = "hmacWithSHA1";
      } else {
        prfAlgorithm = pki.oids[asn1.derToOid(prfOid)];
        if (!prfAlgorithm) {
          var error = new Error("Unsupported PRF OID.");
          error.oid = prfOid;
          error.supported = [
            "hmacWithSHA1",
            "hmacWithSHA224",
            "hmacWithSHA256",
            "hmacWithSHA384",
            "hmacWithSHA512"
          ];
          throw error;
        }
      }
      return prfAlgorithmToMessageDigest(prfAlgorithm);
    }
    function prfAlgorithmToMessageDigest(prfAlgorithm) {
      var factory = forge.md;
      switch (prfAlgorithm) {
        case "hmacWithSHA224":
          factory = forge.md.sha512;
        case "hmacWithSHA1":
        case "hmacWithSHA256":
        case "hmacWithSHA384":
        case "hmacWithSHA512":
          prfAlgorithm = prfAlgorithm.substr(8).toLowerCase();
          break;
        default:
          var error = new Error("Unsupported PRF algorithm.");
          error.algorithm = prfAlgorithm;
          error.supported = [
            "hmacWithSHA1",
            "hmacWithSHA224",
            "hmacWithSHA256",
            "hmacWithSHA384",
            "hmacWithSHA512"
          ];
          throw error;
      }
      if (!factory || !(prfAlgorithm in factory)) {
        throw new Error("Unknown hash algorithm: " + prfAlgorithm);
      }
      return factory[prfAlgorithm].create();
    }
    function createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm) {
      var params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        // salt
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OCTETSTRING,
          false,
          salt
        ),
        // iteration count
        asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.INTEGER,
          false,
          countBytes.getBytes()
        )
      ]);
      if (prfAlgorithm !== "hmacWithSHA1") {
        params.value.push(
          // key length
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            forge.util.hexToBytes(dkLen.toString(16))
          ),
          // AlgorithmIdentifier
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(pki.oids[prfAlgorithm]).getBytes()
            ),
            // parameters (null)
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ])
        );
      }
      return params;
    }
  }
});

// node_modules/uint8arrays/esm/src/concat.js
var concat_exports = {};
__export(concat_exports, {
  concat: () => concat
});
function concat(arrays, length2) {
  if (!length2) {
    length2 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe(length2);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output);
}
var init_concat = __esm({
  "node_modules/uint8arrays/esm/src/concat.js"() {
    init_esbuild_shims();
    init_alloc();
    init_as_uint8array();
  }
});

// node_modules/libp2p-crypto/src/ciphers/aes-gcm.browser.js
var require_aes_gcm_browser = __commonJS({
  "node_modules/libp2p-crypto/src/ciphers/aes-gcm.browser.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var { concat: concat3 } = (init_concat(), __toCommonJS(concat_exports));
    var { fromString: fromString4 } = (init_from_string(), __toCommonJS(from_string_exports));
    var webcrypto = require_webcrypto();
    function create3({
      algorithm = "AES-GCM",
      nonceLength = 12,
      keyLength = 16,
      digest: digest2 = "SHA-256",
      saltLength = 16,
      iterations = 32767
    } = {}) {
      const crypto3 = webcrypto.get();
      keyLength *= 8;
      async function encrypt(data, password) {
        const salt = crypto3.getRandomValues(new Uint8Array(saltLength));
        const nonce = crypto3.getRandomValues(new Uint8Array(nonceLength));
        const aesGcm = { name: algorithm, iv: nonce };
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const rawKey = await crypto3.subtle.importKey("raw", fromString4(password), { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);
        const cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["encrypt"]);
        const ciphertext2 = await crypto3.subtle.encrypt(aesGcm, cryptoKey, data);
        return concat3([salt, aesGcm.iv, new Uint8Array(ciphertext2)]);
      }
      async function decrypt(data, password) {
        const salt = data.slice(0, saltLength);
        const nonce = data.slice(saltLength, saltLength + nonceLength);
        const ciphertext2 = data.slice(saltLength + nonceLength);
        const aesGcm = { name: algorithm, iv: nonce };
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const rawKey = await crypto3.subtle.importKey("raw", fromString4(password), { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);
        const cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["decrypt"]);
        const plaintext = await crypto3.subtle.decrypt(aesGcm, cryptoKey, ciphertext2);
        return new Uint8Array(plaintext);
      }
      return {
        encrypt,
        decrypt
      };
    }
    module2.exports = {
      create: create3
    };
  }
});

// node_modules/libp2p-crypto/src/keys/importer.js
var require_importer = __commonJS({
  "node_modules/libp2p-crypto/src/keys/importer.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var { base64: base642 } = (init_base64(), __toCommonJS(base64_exports));
    var ciphers = require_aes_gcm_browser();
    module2.exports = {
      /**
       * Attempts to decrypt a base64 encoded PrivateKey string
       * with the given password. The privateKey must have been exported
       * using the same password and underlying cipher (aes-gcm)
       *
       * @param {string} privateKey - A base64 encoded encrypted key
       * @param {string} password
       * @returns {Promise<Uint8Array>} The private key protobuf
       */
      import: async function(privateKey, password) {
        const encryptedKey = base642.decode(privateKey);
        const cipher = ciphers.create();
        return await cipher.decrypt(encryptedKey, password);
      }
    };
  }
});

// node_modules/uint8arrays/esm/src/equals.js
var equals_exports = {};
__export(equals_exports, {
  equals: () => equals3
});
function equals3(a, b2) {
  if (a === b2) {
    return true;
  }
  if (a.byteLength !== b2.byteLength) {
    return false;
  }
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b2[i]) {
      return false;
    }
  }
  return true;
}
var init_equals = __esm({
  "node_modules/uint8arrays/esm/src/equals.js"() {
    init_esbuild_shims();
  }
});

// node_modules/node-forge/lib/sha512.js
var require_sha512 = __commonJS({
  "node_modules/node-forge/lib/sha512.js"(exports2, module2) {
    init_esbuild_shims();
    var forge = require_forge();
    require_md();
    require_util();
    var sha5122 = module2.exports = forge.sha512 = forge.sha512 || {};
    forge.md.sha512 = forge.md.algorithms.sha512 = sha5122;
    var sha384 = forge.sha384 = forge.sha512.sha384 = forge.sha512.sha384 || {};
    sha384.create = function() {
      return sha5122.create("SHA-384");
    };
    forge.md.sha384 = forge.md.algorithms.sha384 = sha384;
    forge.sha512.sha256 = forge.sha512.sha256 || {
      create: function() {
        return sha5122.create("SHA-512/256");
      }
    };
    forge.md["sha512/256"] = forge.md.algorithms["sha512/256"] = forge.sha512.sha256;
    forge.sha512.sha224 = forge.sha512.sha224 || {
      create: function() {
        return sha5122.create("SHA-512/224");
      }
    };
    forge.md["sha512/224"] = forge.md.algorithms["sha512/224"] = forge.sha512.sha224;
    sha5122.create = function(algorithm) {
      if (!_initialized) {
        _init();
      }
      if (typeof algorithm === "undefined") {
        algorithm = "SHA-512";
      }
      if (!(algorithm in _states)) {
        throw new Error("Invalid SHA-512 algorithm: " + algorithm);
      }
      var _state = _states[algorithm];
      var _h = null;
      var _input = forge.util.createBuffer();
      var _w = new Array(80);
      for (var wi = 0; wi < 80; ++wi) {
        _w[wi] = new Array(2);
      }
      var digestLength = 64;
      switch (algorithm) {
        case "SHA-384":
          digestLength = 48;
          break;
        case "SHA-512/256":
          digestLength = 32;
          break;
        case "SHA-512/224":
          digestLength = 28;
          break;
      }
      var md = {
        // SHA-512 => sha512
        algorithm: algorithm.replace("-", "").toLowerCase(),
        blockLength: 128,
        digestLength,
        // 56-bit length of message so far (does not including padding)
        messageLength: 0,
        // true message length
        fullMessageLength: null,
        // size of message length in bytes
        messageLengthSize: 16
      };
      md.start = function() {
        md.messageLength = 0;
        md.fullMessageLength = md.messageLength128 = [];
        var int32s = md.messageLengthSize / 4;
        for (var i = 0; i < int32s; ++i) {
          md.fullMessageLength.push(0);
        }
        _input = forge.util.createBuffer();
        _h = new Array(_state.length);
        for (var i = 0; i < _state.length; ++i) {
          _h[i] = _state[i].slice(0);
        }
        return md;
      };
      md.start();
      md.update = function(msg, encoding) {
        if (encoding === "utf8") {
          msg = forge.util.encodeUtf8(msg);
        }
        var len = msg.length;
        md.messageLength += len;
        len = [len / 4294967296 >>> 0, len >>> 0];
        for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
          md.fullMessageLength[i] += len[1];
          len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
          md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
          len[0] = len[1] / 4294967296 >>> 0;
        }
        _input.putBytes(msg);
        _update(_h, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
          _input.compact();
        }
        return md;
      };
      md.digest = function() {
        var finalBlock = forge.util.createBuffer();
        finalBlock.putBytes(_input.bytes());
        var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
        var overflow = remaining & md.blockLength - 1;
        finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
        var next, carry;
        var bits = md.fullMessageLength[0] * 8;
        for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
          next = md.fullMessageLength[i + 1] * 8;
          carry = next / 4294967296 >>> 0;
          bits += carry;
          finalBlock.putInt32(bits >>> 0);
          bits = next >>> 0;
        }
        finalBlock.putInt32(bits);
        var h2 = new Array(_h.length);
        for (var i = 0; i < _h.length; ++i) {
          h2[i] = _h[i].slice(0);
        }
        _update(h2, _w, finalBlock);
        var rval = forge.util.createBuffer();
        var hlen;
        if (algorithm === "SHA-512") {
          hlen = h2.length;
        } else if (algorithm === "SHA-384") {
          hlen = h2.length - 2;
        } else {
          hlen = h2.length - 4;
        }
        for (var i = 0; i < hlen; ++i) {
          rval.putInt32(h2[i][0]);
          if (i !== hlen - 1 || algorithm !== "SHA-512/224") {
            rval.putInt32(h2[i][1]);
          }
        }
        return rval;
      };
      return md;
    };
    var _padding = null;
    var _initialized = false;
    var _k = null;
    var _states = null;
    function _init() {
      _padding = String.fromCharCode(128);
      _padding += forge.util.fillString(String.fromCharCode(0), 128);
      _k = [
        [1116352408, 3609767458],
        [1899447441, 602891725],
        [3049323471, 3964484399],
        [3921009573, 2173295548],
        [961987163, 4081628472],
        [1508970993, 3053834265],
        [2453635748, 2937671579],
        [2870763221, 3664609560],
        [3624381080, 2734883394],
        [310598401, 1164996542],
        [607225278, 1323610764],
        [1426881987, 3590304994],
        [1925078388, 4068182383],
        [2162078206, 991336113],
        [2614888103, 633803317],
        [3248222580, 3479774868],
        [3835390401, 2666613458],
        [4022224774, 944711139],
        [264347078, 2341262773],
        [604807628, 2007800933],
        [770255983, 1495990901],
        [1249150122, 1856431235],
        [1555081692, 3175218132],
        [1996064986, 2198950837],
        [2554220882, 3999719339],
        [2821834349, 766784016],
        [2952996808, 2566594879],
        [3210313671, 3203337956],
        [3336571891, 1034457026],
        [3584528711, 2466948901],
        [113926993, 3758326383],
        [338241895, 168717936],
        [666307205, 1188179964],
        [773529912, 1546045734],
        [1294757372, 1522805485],
        [1396182291, 2643833823],
        [1695183700, 2343527390],
        [1986661051, 1014477480],
        [2177026350, 1206759142],
        [2456956037, 344077627],
        [2730485921, 1290863460],
        [2820302411, 3158454273],
        [3259730800, 3505952657],
        [3345764771, 106217008],
        [3516065817, 3606008344],
        [3600352804, 1432725776],
        [4094571909, 1467031594],
        [275423344, 851169720],
        [430227734, 3100823752],
        [506948616, 1363258195],
        [659060556, 3750685593],
        [883997877, 3785050280],
        [958139571, 3318307427],
        [1322822218, 3812723403],
        [1537002063, 2003034995],
        [1747873779, 3602036899],
        [1955562222, 1575990012],
        [2024104815, 1125592928],
        [2227730452, 2716904306],
        [2361852424, 442776044],
        [2428436474, 593698344],
        [2756734187, 3733110249],
        [3204031479, 2999351573],
        [3329325298, 3815920427],
        [3391569614, 3928383900],
        [3515267271, 566280711],
        [3940187606, 3454069534],
        [4118630271, 4000239992],
        [116418474, 1914138554],
        [174292421, 2731055270],
        [289380356, 3203993006],
        [460393269, 320620315],
        [685471733, 587496836],
        [852142971, 1086792851],
        [1017036298, 365543100],
        [1126000580, 2618297676],
        [1288033470, 3409855158],
        [1501505948, 4234509866],
        [1607167915, 987167468],
        [1816402316, 1246189591]
      ];
      _states = {};
      _states["SHA-512"] = [
        [1779033703, 4089235720],
        [3144134277, 2227873595],
        [1013904242, 4271175723],
        [2773480762, 1595750129],
        [1359893119, 2917565137],
        [2600822924, 725511199],
        [528734635, 4215389547],
        [1541459225, 327033209]
      ];
      _states["SHA-384"] = [
        [3418070365, 3238371032],
        [1654270250, 914150663],
        [2438529370, 812702999],
        [355462360, 4144912697],
        [1731405415, 4290775857],
        [2394180231, 1750603025],
        [3675008525, 1694076839],
        [1203062813, 3204075428]
      ];
      _states["SHA-512/256"] = [
        [573645204, 4230739756],
        [2673172387, 3360449730],
        [596883563, 1867755857],
        [2520282905, 1497426621],
        [2519219938, 2827943907],
        [3193839141, 1401305490],
        [721525244, 746961066],
        [246885852, 2177182882]
      ];
      _states["SHA-512/224"] = [
        [2352822216, 424955298],
        [1944164710, 2312950998],
        [502970286, 855612546],
        [1738396948, 1479516111],
        [258812777, 2077511080],
        [2011393907, 79989058],
        [1067287976, 1780299464],
        [286451373, 2446758561]
      ];
      _initialized = true;
    }
    function _update(s, w2, bytes) {
      var t1_hi, t1_lo;
      var t2_hi, t2_lo;
      var s0_hi, s0_lo;
      var s1_hi, s1_lo;
      var ch_hi, ch_lo;
      var maj_hi, maj_lo;
      var a_hi, a_lo;
      var b_hi, b_lo;
      var c_hi, c_lo;
      var d_hi, d_lo;
      var e_hi, e_lo;
      var f_hi, f_lo;
      var g_hi, g_lo;
      var h_hi, h_lo;
      var i, hi, lo, w22, w7, w15, w16;
      var len = bytes.length();
      while (len >= 128) {
        for (i = 0; i < 16; ++i) {
          w2[i][0] = bytes.getInt32() >>> 0;
          w2[i][1] = bytes.getInt32() >>> 0;
        }
        for (; i < 80; ++i) {
          w22 = w2[i - 2];
          hi = w22[0];
          lo = w22[1];
          t1_hi = ((hi >>> 19 | lo << 13) ^ // ROTR 19
          (lo >>> 29 | hi << 3) ^ // ROTR 61/(swap + ROTR 29)
          hi >>> 6) >>> 0;
          t1_lo = ((hi << 13 | lo >>> 19) ^ // ROTR 19
          (lo << 3 | hi >>> 29) ^ // ROTR 61/(swap + ROTR 29)
          (hi << 26 | lo >>> 6)) >>> 0;
          w15 = w2[i - 15];
          hi = w15[0];
          lo = w15[1];
          t2_hi = ((hi >>> 1 | lo << 31) ^ // ROTR 1
          (hi >>> 8 | lo << 24) ^ // ROTR 8
          hi >>> 7) >>> 0;
          t2_lo = ((hi << 31 | lo >>> 1) ^ // ROTR 1
          (hi << 24 | lo >>> 8) ^ // ROTR 8
          (hi << 25 | lo >>> 7)) >>> 0;
          w7 = w2[i - 7];
          w16 = w2[i - 16];
          lo = t1_lo + w7[1] + t2_lo + w16[1];
          w2[i][0] = t1_hi + w7[0] + t2_hi + w16[0] + (lo / 4294967296 >>> 0) >>> 0;
          w2[i][1] = lo >>> 0;
        }
        a_hi = s[0][0];
        a_lo = s[0][1];
        b_hi = s[1][0];
        b_lo = s[1][1];
        c_hi = s[2][0];
        c_lo = s[2][1];
        d_hi = s[3][0];
        d_lo = s[3][1];
        e_hi = s[4][0];
        e_lo = s[4][1];
        f_hi = s[5][0];
        f_lo = s[5][1];
        g_hi = s[6][0];
        g_lo = s[6][1];
        h_hi = s[7][0];
        h_lo = s[7][1];
        for (i = 0; i < 80; ++i) {
          s1_hi = ((e_hi >>> 14 | e_lo << 18) ^ // ROTR 14
          (e_hi >>> 18 | e_lo << 14) ^ // ROTR 18
          (e_lo >>> 9 | e_hi << 23)) >>> 0;
          s1_lo = ((e_hi << 18 | e_lo >>> 14) ^ // ROTR 14
          (e_hi << 14 | e_lo >>> 18) ^ // ROTR 18
          (e_lo << 23 | e_hi >>> 9)) >>> 0;
          ch_hi = (g_hi ^ e_hi & (f_hi ^ g_hi)) >>> 0;
          ch_lo = (g_lo ^ e_lo & (f_lo ^ g_lo)) >>> 0;
          s0_hi = ((a_hi >>> 28 | a_lo << 4) ^ // ROTR 28
          (a_lo >>> 2 | a_hi << 30) ^ // ROTR 34/(swap + ROTR 2)
          (a_lo >>> 7 | a_hi << 25)) >>> 0;
          s0_lo = ((a_hi << 4 | a_lo >>> 28) ^ // ROTR 28
          (a_lo << 30 | a_hi >>> 2) ^ // ROTR 34/(swap + ROTR 2)
          (a_lo << 25 | a_hi >>> 7)) >>> 0;
          maj_hi = (a_hi & b_hi | c_hi & (a_hi ^ b_hi)) >>> 0;
          maj_lo = (a_lo & b_lo | c_lo & (a_lo ^ b_lo)) >>> 0;
          lo = h_lo + s1_lo + ch_lo + _k[i][1] + w2[i][1];
          t1_hi = h_hi + s1_hi + ch_hi + _k[i][0] + w2[i][0] + (lo / 4294967296 >>> 0) >>> 0;
          t1_lo = lo >>> 0;
          lo = s0_lo + maj_lo;
          t2_hi = s0_hi + maj_hi + (lo / 4294967296 >>> 0) >>> 0;
          t2_lo = lo >>> 0;
          h_hi = g_hi;
          h_lo = g_lo;
          g_hi = f_hi;
          g_lo = f_lo;
          f_hi = e_hi;
          f_lo = e_lo;
          lo = d_lo + t1_lo;
          e_hi = d_hi + t1_hi + (lo / 4294967296 >>> 0) >>> 0;
          e_lo = lo >>> 0;
          d_hi = c_hi;
          d_lo = c_lo;
          c_hi = b_hi;
          c_lo = b_lo;
          b_hi = a_hi;
          b_lo = a_lo;
          lo = t1_lo + t2_lo;
          a_hi = t1_hi + t2_hi + (lo / 4294967296 >>> 0) >>> 0;
          a_lo = lo >>> 0;
        }
        lo = s[0][1] + a_lo;
        s[0][0] = s[0][0] + a_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[0][1] = lo >>> 0;
        lo = s[1][1] + b_lo;
        s[1][0] = s[1][0] + b_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[1][1] = lo >>> 0;
        lo = s[2][1] + c_lo;
        s[2][0] = s[2][0] + c_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[2][1] = lo >>> 0;
        lo = s[3][1] + d_lo;
        s[3][0] = s[3][0] + d_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[3][1] = lo >>> 0;
        lo = s[4][1] + e_lo;
        s[4][0] = s[4][0] + e_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[4][1] = lo >>> 0;
        lo = s[5][1] + f_lo;
        s[5][0] = s[5][0] + f_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[5][1] = lo >>> 0;
        lo = s[6][1] + g_lo;
        s[6][0] = s[6][0] + g_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[6][1] = lo >>> 0;
        lo = s[7][1] + h_lo;
        s[7][0] = s[7][0] + h_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[7][1] = lo >>> 0;
        len -= 128;
      }
    }
  }
});

// node_modules/iso-random-stream/src/random.browser.js
var require_random_browser = __commonJS({
  "node_modules/iso-random-stream/src/random.browser.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var MAX_BYTES = 65536;
    function randomBytes(size) {
      const bytes = new Uint8Array(size);
      let generated = 0;
      if (size > 0) {
        if (size > MAX_BYTES) {
          while (generated < size) {
            if (generated + MAX_BYTES > size) {
              crypto.getRandomValues(
                bytes.subarray(generated, generated + (size - generated))
              );
              generated += size - generated;
            } else {
              crypto.getRandomValues(
                bytes.subarray(generated, generated + MAX_BYTES)
              );
              generated += MAX_BYTES;
            }
          }
        } else {
          crypto.getRandomValues(bytes);
        }
      }
      return bytes;
    }
    module2.exports = randomBytes;
  }
});

// node_modules/libp2p-crypto/src/random-bytes.js
var require_random_bytes = __commonJS({
  "node_modules/libp2p-crypto/src/random-bytes.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var randomBytes = require_random_browser();
    var errcode = require_err_code();
    module2.exports = function(length2) {
      if (isNaN(length2) || length2 <= 0) {
        throw errcode(new Error("random bytes length must be a Number bigger than 0"), "ERR_INVALID_LENGTH");
      }
      return randomBytes(length2);
    };
  }
});

// node_modules/libp2p-crypto/src/util.js
var require_util2 = __commonJS({
  "node_modules/libp2p-crypto/src/util.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    require_util();
    require_jsbn();
    var forge = require_forge();
    var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    var { concat: uint8ArrayConcat } = (init_concat(), __toCommonJS(concat_exports));
    exports2.bigIntegerToUintBase64url = (num, len) => {
      let buf2 = Uint8Array.from(num.abs().toByteArray());
      buf2 = buf2[0] === 0 ? buf2.slice(1) : buf2;
      if (len != null) {
        if (buf2.length > len) throw new Error("byte array longer than desired length");
        buf2 = uint8ArrayConcat([new Uint8Array(len - buf2.length), buf2]);
      }
      return uint8ArrayToString(buf2, "base64url");
    };
    exports2.base64urlToBigInteger = (str) => {
      const buf2 = exports2.base64urlToBuffer(str);
      return new forge.jsbn.BigInteger(uint8ArrayToString(buf2, "base16"), 16);
    };
    exports2.base64urlToBuffer = (str, len) => {
      let buf2 = uint8ArrayFromString(str, "base64urlpad");
      if (len != null) {
        if (buf2.length > len) throw new Error("byte array longer than desired length");
        buf2 = uint8ArrayConcat([new Uint8Array(len - buf2.length), buf2]);
      }
      return buf2;
    };
  }
});

// node_modules/libp2p-crypto/src/keys/rsa-utils.js
var require_rsa_utils = __commonJS({
  "node_modules/libp2p-crypto/src/keys/rsa-utils.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    require_asn1();
    require_rsa();
    var forge = require_forge();
    var { bigIntegerToUintBase64url, base64urlToBigInteger } = require_util2();
    var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    exports2.pkcs1ToJwk = function(bytes) {
      const asn1 = forge.asn1.fromDer(uint8ArrayToString(bytes, "ascii"));
      const privateKey = forge.pki.privateKeyFromAsn1(asn1);
      return {
        kty: "RSA",
        n: bigIntegerToUintBase64url(privateKey.n),
        e: bigIntegerToUintBase64url(privateKey.e),
        d: bigIntegerToUintBase64url(privateKey.d),
        p: bigIntegerToUintBase64url(privateKey.p),
        q: bigIntegerToUintBase64url(privateKey.q),
        dp: bigIntegerToUintBase64url(privateKey.dP),
        dq: bigIntegerToUintBase64url(privateKey.dQ),
        qi: bigIntegerToUintBase64url(privateKey.qInv),
        alg: "RS256",
        kid: "2011-04-29"
      };
    };
    exports2.jwkToPkcs1 = function(jwk) {
      const asn1 = forge.pki.privateKeyToAsn1({
        n: base64urlToBigInteger(jwk.n),
        e: base64urlToBigInteger(jwk.e),
        d: base64urlToBigInteger(jwk.d),
        p: base64urlToBigInteger(jwk.p),
        q: base64urlToBigInteger(jwk.q),
        dP: base64urlToBigInteger(jwk.dp),
        dQ: base64urlToBigInteger(jwk.dq),
        qInv: base64urlToBigInteger(jwk.qi)
      });
      return uint8ArrayFromString(forge.asn1.toDer(asn1).getBytes(), "ascii");
    };
    exports2.pkixToJwk = function(bytes) {
      const asn1 = forge.asn1.fromDer(uint8ArrayToString(bytes, "ascii"));
      const publicKey = forge.pki.publicKeyFromAsn1(asn1);
      return {
        kty: "RSA",
        n: bigIntegerToUintBase64url(publicKey.n),
        e: bigIntegerToUintBase64url(publicKey.e),
        alg: "RS256",
        kid: "2011-04-29"
      };
    };
    exports2.jwkToPkix = function(jwk) {
      const asn1 = forge.pki.publicKeyToAsn1({
        n: base64urlToBigInteger(jwk.n),
        e: base64urlToBigInteger(jwk.e)
      });
      return uint8ArrayFromString(forge.asn1.toDer(asn1).getBytes(), "ascii");
    };
  }
});

// node_modules/libp2p-crypto/src/keys/jwk2pem.js
var require_jwk2pem = __commonJS({
  "node_modules/libp2p-crypto/src/keys/jwk2pem.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    require_rsa();
    var forge = require_forge();
    var { base64urlToBigInteger } = require_util2();
    function convert(key, types) {
      return types.map((t2) => base64urlToBigInteger(key[t2]));
    }
    function jwk2priv(key) {
      return forge.pki.setRsaPrivateKey(...convert(key, ["n", "e", "d", "p", "q", "dp", "dq", "qi"]));
    }
    function jwk2pub(key) {
      return forge.pki.setRsaPublicKey(...convert(key, ["n", "e"]));
    }
    module2.exports = {
      jwk2pub,
      jwk2priv
    };
  }
});

// node_modules/libp2p-crypto/src/keys/rsa-browser.js
var require_rsa_browser = __commonJS({
  "node_modules/libp2p-crypto/src/keys/rsa-browser.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var webcrypto = require_webcrypto();
    var randomBytes = require_random_bytes();
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
    exports2.utils = require_rsa_utils();
    exports2.generateKey = async function(bits) {
      const pair = await webcrypto.get().subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: bits,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: "SHA-256" }
        },
        true,
        ["sign", "verify"]
      );
      const keys = await exportKey(pair);
      return {
        privateKey: keys[0],
        publicKey: keys[1]
      };
    };
    exports2.unmarshalPrivateKey = async function(key) {
      const privateKey = await webcrypto.get().subtle.importKey(
        "jwk",
        key,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        },
        true,
        ["sign"]
      );
      const pair = [
        privateKey,
        await derivePublicFromPrivate(key)
      ];
      const keys = await exportKey({
        privateKey: pair[0],
        publicKey: pair[1]
      });
      return {
        privateKey: keys[0],
        publicKey: keys[1]
      };
    };
    exports2.getRandomValues = randomBytes;
    exports2.hashAndSign = async function(key, msg) {
      const privateKey = await webcrypto.get().subtle.importKey(
        "jwk",
        key,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        },
        false,
        ["sign"]
      );
      const sig = await webcrypto.get().subtle.sign(
        { name: "RSASSA-PKCS1-v1_5" },
        privateKey,
        Uint8Array.from(msg)
      );
      return new Uint8Array(sig, sig.byteOffset, sig.byteLength);
    };
    exports2.hashAndVerify = async function(key, sig, msg) {
      const publicKey = await webcrypto.get().subtle.importKey(
        "jwk",
        key,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        },
        false,
        ["verify"]
      );
      return webcrypto.get().subtle.verify(
        { name: "RSASSA-PKCS1-v1_5" },
        publicKey,
        sig,
        msg
      );
    };
    function exportKey(pair) {
      return Promise.all([
        webcrypto.get().subtle.exportKey("jwk", pair.privateKey),
        webcrypto.get().subtle.exportKey("jwk", pair.publicKey)
      ]);
    }
    function derivePublicFromPrivate(jwKey) {
      return webcrypto.get().subtle.importKey(
        "jwk",
        {
          kty: jwKey.kty,
          n: jwKey.n,
          e: jwKey.e
        },
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        },
        true,
        ["verify"]
      );
    }
    var { jwk2pub, jwk2priv } = require_jwk2pem();
    function convertKey(key, pub, msg, handle) {
      const fkey = pub ? jwk2pub(key) : jwk2priv(key);
      const fmsg = uint8ArrayToString(Uint8Array.from(msg), "ascii");
      const fomsg = handle(fmsg, fkey);
      return uint8ArrayFromString(fomsg, "ascii");
    }
    exports2.encrypt = function(key, msg) {
      return convertKey(key, true, msg, (msg2, key2) => key2.encrypt(msg2));
    };
    exports2.decrypt = function(key, msg) {
      return convertKey(key, false, msg, (msg2, key2) => key2.decrypt(msg2));
    };
  }
});

// node_modules/libp2p-crypto/src/keys/exporter.js
var require_exporter = __commonJS({
  "node_modules/libp2p-crypto/src/keys/exporter.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var { base64: base642 } = (init_base64(), __toCommonJS(base64_exports));
    var ciphers = require_aes_gcm_browser();
    module2.exports = {
      /**
       * Exports the given PrivateKey as a base64 encoded string.
       * The PrivateKey is encrypted via a password derived PBKDF2 key
       * leveraging the aes-gcm cipher algorithm.
       *
       * @param {Uint8Array} privateKey - The PrivateKey protobuf
       * @param {string} password
       * @returns {Promise<string>} A base64 encoded string
       */
      export: async function(privateKey, password) {
        const cipher = ciphers.create();
        const encryptedKey = await cipher.encrypt(privateKey, password);
        return base642.encode(encryptedKey);
      }
    };
  }
});

// node_modules/libp2p-crypto/src/keys/rsa-class.js
var require_rsa_class = __commonJS({
  "node_modules/libp2p-crypto/src/keys/rsa-class.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
    var errcode = require_err_code();
    var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    require_sha512();
    var forge = require_forge();
    var crypto3 = require_rsa_browser();
    var pbm = require_keys();
    var exporter = require_exporter();
    var RsaPublicKey = class {
      constructor(key) {
        this._key = key;
      }
      async verify(data, sig) {
        return crypto3.hashAndVerify(this._key, sig, data);
      }
      marshal() {
        return crypto3.utils.jwkToPkix(this._key);
      }
      get bytes() {
        return pbm.PublicKey.encode({
          Type: pbm.KeyType.RSA,
          Data: this.marshal()
        }).finish();
      }
      encrypt(bytes) {
        return crypto3.encrypt(this._key, bytes);
      }
      equals(key) {
        return uint8ArrayEquals(this.bytes, key.bytes);
      }
      async hash() {
        const { bytes } = await sha2562.digest(this.bytes);
        return bytes;
      }
    };
    var RsaPrivateKey = class {
      // key       - Object of the jwk format
      // publicKey - Uint8Array of the spki format
      constructor(key, publicKey) {
        this._key = key;
        this._publicKey = publicKey;
      }
      genSecret() {
        return crypto3.getRandomValues(16);
      }
      async sign(message) {
        return crypto3.hashAndSign(this._key, message);
      }
      get public() {
        if (!this._publicKey) {
          throw errcode(new Error("public key not provided"), "ERR_PUBKEY_NOT_PROVIDED");
        }
        return new RsaPublicKey(this._publicKey);
      }
      decrypt(bytes) {
        return crypto3.decrypt(this._key, bytes);
      }
      marshal() {
        return crypto3.utils.jwkToPkcs1(this._key);
      }
      get bytes() {
        return pbm.PrivateKey.encode({
          Type: pbm.KeyType.RSA,
          Data: this.marshal()
        }).finish();
      }
      equals(key) {
        return uint8ArrayEquals(this.bytes, key.bytes);
      }
      async hash() {
        const { bytes } = await sha2562.digest(this.bytes);
        return bytes;
      }
      /**
       * Gets the ID of the key.
       *
       * The key id is the base58 encoding of the SHA-256 multihash of its public key.
       * The public key is a protobuf encoding containing a type and the DER encoding
       * of the PKCS SubjectPublicKeyInfo.
       *
       * @returns {Promise<string>}
       */
      async id() {
        const hash = await this.public.hash();
        return uint8ArrayToString(hash, "base58btc");
      }
      /**
       * Exports the key into a password protected PEM format
       *
       * @param {string} password - The password to read the encrypted PEM
       * @param {string} [format=pkcs-8] - The format in which to export as
       */
      async export(password, format = "pkcs-8") {
        if (format === "pkcs-8") {
          const buffer2 = new forge.util.ByteBuffer(this.marshal());
          const asn1 = forge.asn1.fromDer(buffer2);
          const privateKey = forge.pki.privateKeyFromAsn1(asn1);
          const options = {
            algorithm: "aes256",
            count: 1e4,
            saltSize: 128 / 8,
            prfAlgorithm: "sha512"
          };
          return forge.pki.encryptRsaPrivateKey(privateKey, password, options);
        } else if (format === "libp2p-key") {
          return exporter.export(this.bytes, password);
        } else {
          throw errcode(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
        }
      }
    };
    async function unmarshalRsaPrivateKey(bytes) {
      const jwk = crypto3.utils.pkcs1ToJwk(bytes);
      const keys = await crypto3.unmarshalPrivateKey(jwk);
      return new RsaPrivateKey(keys.privateKey, keys.publicKey);
    }
    function unmarshalRsaPublicKey(bytes) {
      const jwk = crypto3.utils.pkixToJwk(bytes);
      return new RsaPublicKey(jwk);
    }
    async function fromJwk(jwk) {
      const keys = await crypto3.unmarshalPrivateKey(jwk);
      return new RsaPrivateKey(keys.privateKey, keys.publicKey);
    }
    async function generateKeyPair(bits) {
      const keys = await crypto3.generateKey(bits);
      return new RsaPrivateKey(keys.privateKey, keys.publicKey);
    }
    module2.exports = {
      RsaPublicKey,
      RsaPrivateKey,
      unmarshalRsaPublicKey,
      unmarshalRsaPrivateKey,
      generateKeyPair,
      fromJwk
    };
  }
});

// node_modules/@noble/ed25519/lib/index.js
var require_lib = __commonJS({
  "node_modules/@noble/ed25519/lib/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.utils = exports2.curve25519 = exports2.getSharedSecret = exports2.sync = exports2.verify = exports2.sign = exports2.getPublicKey = exports2.hexToBytes = exports2.bytesToHex = exports2.Signature = exports2.RistrettoPoint = exports2.Point = exports2.ExtendedPoint = exports2.CURVE = void 0;
    var nodeCrypto = require_crypto();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _8n = BigInt(8);
    var CU_O = BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989");
    var CURVE = Object.freeze({
      a: BigInt(-1),
      d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
      P: BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"),
      l: CU_O,
      n: CU_O,
      h: BigInt(8),
      Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
      Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
    });
    exports2.CURVE = CURVE;
    var POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
    var SQRT_M1 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
    var SQRT_D = BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");
    var SQRT_AD_MINUS_ONE = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
    var INVSQRT_A_MINUS_D = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
    var ONE_MINUS_D_SQ = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
    var D_MINUS_ONE_SQ = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
    var ExtendedPoint = class _ExtendedPoint {
      constructor(x, y2, z, t2) {
        this.x = x;
        this.y = y2;
        this.z = z;
        this.t = t2;
      }
      static fromAffine(p2) {
        if (!(p2 instanceof Point)) {
          throw new TypeError("ExtendedPoint#fromAffine: expected Point");
        }
        if (p2.equals(Point.ZERO))
          return _ExtendedPoint.ZERO;
        return new _ExtendedPoint(p2.x, p2.y, _1n, mod2(p2.x * p2.y));
      }
      static toAffineBatch(points) {
        const toInv = invertBatch(points.map((p2) => p2.z));
        return points.map((p2, i) => p2.toAffine(toInv[i]));
      }
      static normalizeZ(points) {
        return this.toAffineBatch(points).map(this.fromAffine);
      }
      equals(other) {
        assertExtPoint(other);
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        const X1Z2 = mod2(X1 * Z2);
        const X2Z1 = mod2(X2 * Z1);
        const Y1Z2 = mod2(Y1 * Z2);
        const Y2Z1 = mod2(Y2 * Z1);
        return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
      }
      negate() {
        return new _ExtendedPoint(mod2(-this.x), this.y, this.z, mod2(-this.t));
      }
      double() {
        const { x: X1, y: Y1, z: Z1 } = this;
        const { a } = CURVE;
        const M = mod2;
        const A = M(X1 * X1);
        const B = M(Y1 * Y1);
        const C = M(_2n * M(Z1 * Z1));
        const D = M(a * A);
        const x1y1 = X1 + Y1;
        const E = M(M(x1y1 * x1y1) - A - B);
        const G = D + B;
        const F = G - C;
        const H = D - B;
        const X3 = M(E * F);
        const Y3 = M(G * H);
        const T3 = M(E * H);
        const Z3 = M(F * G);
        return new _ExtendedPoint(X3, Y3, Z3, T3);
      }
      add(other) {
        const { x: X1, y: Y1, z: Z1, t: T1 } = this;
        assertExtPoint(other);
        const { x: X2, y: Y2, z: Z2, t: T2 } = other;
        const { a, d: d2 } = CURVE;
        const M = mod2;
        const A = M(X1 * X2);
        const B = M(Y1 * Y2);
        const C = M(T1 * d2 * T2);
        const D = M(Z1 * Z2);
        const E = M((X1 + Y1) * (X2 + Y2) - A - B);
        const F = M(D - C);
        const G = M(D + C);
        const H = M(B - a * A);
        const X3 = M(E * F);
        const Y3 = M(G * H);
        const T3 = M(E * H);
        const Z3 = M(F * G);
        return new _ExtendedPoint(X3, Y3, Z3, T3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      precomputeWindow(W) {
        const windows = 1 + 256 / W;
        const points = [];
        let p2 = this;
        let base3 = p2;
        for (let window2 = 0; window2 < windows; window2++) {
          base3 = p2;
          points.push(base3);
          for (let i = 1; i < 2 ** (W - 1); i++) {
            base3 = base3.add(p2);
            points.push(base3);
          }
          p2 = base3.double();
        }
        return points;
      }
      wNAF(n2, affinePoint) {
        if (!affinePoint && this.equals(_ExtendedPoint.BASE))
          affinePoint = Point.BASE;
        const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
        if (256 % W) {
          throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
        }
        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
        if (!precomputes) {
          precomputes = this.precomputeWindow(W);
          if (affinePoint && W !== 1) {
            precomputes = _ExtendedPoint.normalizeZ(precomputes);
            pointPrecomputes.set(affinePoint, precomputes);
          }
        }
        let p2 = _ExtendedPoint.ZERO;
        let f2 = _ExtendedPoint.BASE;
        const windows = 1 + 256 / W;
        const windowSize = 2 ** (W - 1);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          let wbits = Number(n2 & mask);
          n2 >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n2 += _1n;
          }
          const offset1 = offset;
          const offset2 = offset + Math.abs(wbits) - 1;
          const cond1 = window2 % 2 !== 0;
          const cond2 = wbits < 0;
          if (wbits === 0) {
            f2 = f2.add(constTimeNegate(cond1, precomputes[offset1]));
          } else {
            p2 = p2.add(constTimeNegate(cond2, precomputes[offset2]));
          }
        }
        return _ExtendedPoint.normalizeZ([p2, f2])[0];
      }
      multiply(scalar, affinePoint) {
        return this.wNAF(normalizeScalar(scalar, CURVE.l), affinePoint);
      }
      multiplyUnsafe(scalar) {
        let n2 = normalizeScalar(scalar, CURVE.l, false);
        const G = _ExtendedPoint.BASE;
        const P0 = _ExtendedPoint.ZERO;
        if (n2 === _0n)
          return P0;
        if (this.equals(P0) || n2 === _1n)
          return this;
        if (this.equals(G))
          return this.wNAF(n2);
        let p2 = P0;
        let d2 = this;
        while (n2 > _0n) {
          if (n2 & _1n)
            p2 = p2.add(d2);
          d2 = d2.double();
          n2 >>= _1n;
        }
        return p2;
      }
      isSmallOrder() {
        return this.multiplyUnsafe(CURVE.h).equals(_ExtendedPoint.ZERO);
      }
      isTorsionFree() {
        let p2 = this.multiplyUnsafe(CURVE.l / _2n).double();
        if (CURVE.l % _2n)
          p2 = p2.add(this);
        return p2.equals(_ExtendedPoint.ZERO);
      }
      toAffine(invZ) {
        const { x, y: y2, z } = this;
        const is0 = this.equals(_ExtendedPoint.ZERO);
        if (invZ == null)
          invZ = is0 ? _8n : invert(z);
        const ax = mod2(x * invZ);
        const ay = mod2(y2 * invZ);
        const zz = mod2(z * invZ);
        if (is0)
          return Point.ZERO;
        if (zz !== _1n)
          throw new Error("invZ was invalid");
        return new Point(ax, ay);
      }
      fromRistrettoBytes() {
        legacyRist();
      }
      toRistrettoBytes() {
        legacyRist();
      }
      fromRistrettoHash() {
        legacyRist();
      }
    };
    exports2.ExtendedPoint = ExtendedPoint;
    ExtendedPoint.BASE = new ExtendedPoint(CURVE.Gx, CURVE.Gy, _1n, mod2(CURVE.Gx * CURVE.Gy));
    ExtendedPoint.ZERO = new ExtendedPoint(_0n, _1n, _1n, _0n);
    function constTimeNegate(condition, item) {
      const neg = item.negate();
      return condition ? neg : item;
    }
    function assertExtPoint(other) {
      if (!(other instanceof ExtendedPoint))
        throw new TypeError("ExtendedPoint expected");
    }
    function assertRstPoint(other) {
      if (!(other instanceof RistrettoPoint))
        throw new TypeError("RistrettoPoint expected");
    }
    function legacyRist() {
      throw new Error("Legacy method: switch to RistrettoPoint");
    }
    var RistrettoPoint = class _RistrettoPoint {
      constructor(ep) {
        this.ep = ep;
      }
      static calcElligatorRistrettoMap(r0) {
        const { d: d2 } = CURVE;
        const r = mod2(SQRT_M1 * r0 * r0);
        const Ns = mod2((r + _1n) * ONE_MINUS_D_SQ);
        let c = BigInt(-1);
        const D = mod2((c - d2 * r) * mod2(r + d2));
        let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
        let s_ = mod2(s * r0);
        if (!edIsNegative(s_))
          s_ = mod2(-s_);
        if (!Ns_D_is_sq)
          s = s_;
        if (!Ns_D_is_sq)
          c = r;
        const Nt = mod2(c * (r - _1n) * D_MINUS_ONE_SQ - D);
        const s2 = s * s;
        const W0 = mod2((s + s) * D);
        const W1 = mod2(Nt * SQRT_AD_MINUS_ONE);
        const W2 = mod2(_1n - s2);
        const W3 = mod2(_1n + s2);
        return new ExtendedPoint(mod2(W0 * W3), mod2(W2 * W1), mod2(W1 * W3), mod2(W0 * W2));
      }
      static hashToCurve(hex) {
        hex = ensureBytes(hex, 64);
        const r1 = bytes255ToNumberLE(hex.slice(0, 32));
        const R1 = this.calcElligatorRistrettoMap(r1);
        const r2 = bytes255ToNumberLE(hex.slice(32, 64));
        const R2 = this.calcElligatorRistrettoMap(r2);
        return new _RistrettoPoint(R1.add(R2));
      }
      static fromHex(hex) {
        hex = ensureBytes(hex, 32);
        const { a, d: d2 } = CURVE;
        const emsg = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint";
        const s = bytes255ToNumberLE(hex);
        if (!equalBytes(numberTo32BytesLE(s), hex) || edIsNegative(s))
          throw new Error(emsg);
        const s2 = mod2(s * s);
        const u1 = mod2(_1n + a * s2);
        const u2 = mod2(_1n - a * s2);
        const u1_2 = mod2(u1 * u1);
        const u2_2 = mod2(u2 * u2);
        const v2 = mod2(a * d2 * u1_2 - u2_2);
        const { isValid, value: I } = invertSqrt(mod2(v2 * u2_2));
        const Dx = mod2(I * u2);
        const Dy = mod2(I * Dx * v2);
        let x = mod2((s + s) * Dx);
        if (edIsNegative(x))
          x = mod2(-x);
        const y2 = mod2(u1 * Dy);
        const t2 = mod2(x * y2);
        if (!isValid || edIsNegative(t2) || y2 === _0n)
          throw new Error(emsg);
        return new _RistrettoPoint(new ExtendedPoint(x, y2, _1n, t2));
      }
      toRawBytes() {
        let { x, y: y2, z, t: t2 } = this.ep;
        const u1 = mod2(mod2(z + y2) * mod2(z - y2));
        const u2 = mod2(x * y2);
        const u2sq = mod2(u2 * u2);
        const { value: invsqrt } = invertSqrt(mod2(u1 * u2sq));
        const D1 = mod2(invsqrt * u1);
        const D2 = mod2(invsqrt * u2);
        const zInv = mod2(D1 * D2 * t2);
        let D;
        if (edIsNegative(t2 * zInv)) {
          let _x = mod2(y2 * SQRT_M1);
          let _y = mod2(x * SQRT_M1);
          x = _x;
          y2 = _y;
          D = mod2(D1 * INVSQRT_A_MINUS_D);
        } else {
          D = D2;
        }
        if (edIsNegative(x * zInv))
          y2 = mod2(-y2);
        let s = mod2((z - y2) * D);
        if (edIsNegative(s))
          s = mod2(-s);
        return numberTo32BytesLE(s);
      }
      toHex() {
        return bytesToHex(this.toRawBytes());
      }
      toString() {
        return this.toHex();
      }
      equals(other) {
        assertRstPoint(other);
        const a = this.ep;
        const b2 = other.ep;
        const one = mod2(a.x * b2.y) === mod2(a.y * b2.x);
        const two = mod2(a.y * b2.y) === mod2(a.x * b2.x);
        return one || two;
      }
      add(other) {
        assertRstPoint(other);
        return new _RistrettoPoint(this.ep.add(other.ep));
      }
      subtract(other) {
        assertRstPoint(other);
        return new _RistrettoPoint(this.ep.subtract(other.ep));
      }
      multiply(scalar) {
        return new _RistrettoPoint(this.ep.multiply(scalar));
      }
      multiplyUnsafe(scalar) {
        return new _RistrettoPoint(this.ep.multiplyUnsafe(scalar));
      }
    };
    exports2.RistrettoPoint = RistrettoPoint;
    RistrettoPoint.BASE = new RistrettoPoint(ExtendedPoint.BASE);
    RistrettoPoint.ZERO = new RistrettoPoint(ExtendedPoint.ZERO);
    var pointPrecomputes = /* @__PURE__ */ new WeakMap();
    var Point = class _Point {
      constructor(x, y2) {
        this.x = x;
        this.y = y2;
      }
      _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
      }
      static fromHex(hex, strict = true) {
        const { d: d2, P } = CURVE;
        hex = ensureBytes(hex, 32);
        const normed = hex.slice();
        normed[31] = hex[31] & ~128;
        const y2 = bytesToNumberLE(normed);
        if (strict && y2 >= P)
          throw new Error("Expected 0 < hex < P");
        if (!strict && y2 >= POW_2_256)
          throw new Error("Expected 0 < hex < 2**256");
        const y22 = mod2(y2 * y2);
        const u = mod2(y22 - _1n);
        const v2 = mod2(d2 * y22 + _1n);
        let { isValid, value: x } = uvRatio(u, v2);
        if (!isValid)
          throw new Error("Point.fromHex: invalid y coordinate");
        const isXOdd = (x & _1n) === _1n;
        const isLastByteOdd = (hex[31] & 128) !== 0;
        if (isLastByteOdd !== isXOdd) {
          x = mod2(-x);
        }
        return new _Point(x, y2);
      }
      static async fromPrivateKey(privateKey) {
        return (await getExtendedPublicKey(privateKey)).point;
      }
      toRawBytes() {
        const bytes = numberTo32BytesLE(this.y);
        bytes[31] |= this.x & _1n ? 128 : 0;
        return bytes;
      }
      toHex() {
        return bytesToHex(this.toRawBytes());
      }
      toX25519() {
        const { y: y2 } = this;
        const u = mod2((_1n + y2) * invert(_1n - y2));
        return numberTo32BytesLE(u);
      }
      isTorsionFree() {
        return ExtendedPoint.fromAffine(this).isTorsionFree();
      }
      equals(other) {
        return this.x === other.x && this.y === other.y;
      }
      negate() {
        return new _Point(mod2(-this.x), this.y);
      }
      add(other) {
        return ExtendedPoint.fromAffine(this).add(ExtendedPoint.fromAffine(other)).toAffine();
      }
      subtract(other) {
        return this.add(other.negate());
      }
      multiply(scalar) {
        return ExtendedPoint.fromAffine(this).multiply(scalar, this).toAffine();
      }
    };
    exports2.Point = Point;
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
    Point.ZERO = new Point(_0n, _1n);
    var Signature = class _Signature {
      constructor(r, s) {
        this.r = r;
        this.s = s;
        this.assertValidity();
      }
      static fromHex(hex) {
        const bytes = ensureBytes(hex, 64);
        const r = Point.fromHex(bytes.slice(0, 32), false);
        const s = bytesToNumberLE(bytes.slice(32, 64));
        return new _Signature(r, s);
      }
      assertValidity() {
        const { r, s } = this;
        if (!(r instanceof Point))
          throw new Error("Expected Point instance");
        normalizeScalar(s, CURVE.l, false);
        return this;
      }
      toRawBytes() {
        const u8 = new Uint8Array(64);
        u8.set(this.r.toRawBytes());
        u8.set(numberTo32BytesLE(this.s), 32);
        return u8;
      }
      toHex() {
        return bytesToHex(this.toRawBytes());
      }
    };
    exports2.Signature = Signature;
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function abytes(item) {
      if (!isBytes(item))
        throw new Error("Uint8Array expected");
    }
    function concatBytes(...arrays) {
      arrays.every(abytes);
      if (arrays.length === 1)
        return arrays[0];
      const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
      const result = new Uint8Array(length2);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
      }
      return result;
    }
    var hexes = Array.from({ length: 256 }, (_2, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    exports2.bytesToHex = bytesToHex;
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    exports2.hexToBytes = hexToBytes;
    function numberTo32BytesBE(num) {
      const length2 = 32;
      const hex = num.toString(16).padStart(length2 * 2, "0");
      return hexToBytes(hex);
    }
    function numberTo32BytesLE(num) {
      return numberTo32BytesBE(num).reverse();
    }
    function edIsNegative(num) {
      return (mod2(num) & _1n) === _1n;
    }
    function bytesToNumberLE(uint8a) {
      abytes(uint8a);
      return BigInt("0x" + bytesToHex(Uint8Array.from(uint8a).reverse()));
    }
    var MAX_255B = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    function bytes255ToNumberLE(bytes) {
      return mod2(bytesToNumberLE(bytes) & MAX_255B);
    }
    function mod2(a, b2 = CURVE.P) {
      const res = a % b2;
      return res >= _0n ? res : b2 + res;
    }
    function invert(number, modulo = CURVE.P) {
      if (number === _0n || modulo <= _0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
      }
      let a = mod2(number, modulo);
      let b2 = modulo;
      let x = _0n, y2 = _1n, u = _1n, v2 = _0n;
      while (a !== _0n) {
        const q2 = b2 / a;
        const r = b2 % a;
        const m = x - u * q2;
        const n2 = y2 - v2 * q2;
        b2 = a, a = r, x = u, y2 = v2, u = m, v2 = n2;
      }
      const gcd = b2;
      if (gcd !== _1n)
        throw new Error("invert: does not exist");
      return mod2(x, modulo);
    }
    function invertBatch(nums, p2 = CURVE.P) {
      const tmp = new Array(nums.length);
      const lastMultiplied = nums.reduce((acc, num, i) => {
        if (num === _0n)
          return acc;
        tmp[i] = acc;
        return mod2(acc * num, p2);
      }, _1n);
      const inverted = invert(lastMultiplied, p2);
      nums.reduceRight((acc, num, i) => {
        if (num === _0n)
          return acc;
        tmp[i] = mod2(acc * tmp[i], p2);
        return mod2(acc * num, p2);
      }, inverted);
      return tmp;
    }
    function pow2(x, power) {
      const { P } = CURVE;
      let res = x;
      while (power-- > _0n) {
        res *= res;
        res %= P;
      }
      return res;
    }
    function pow_2_252_3(x) {
      const { P } = CURVE;
      const _5n = BigInt(5);
      const _10n = BigInt(10);
      const _20n = BigInt(20);
      const _40n = BigInt(40);
      const _80n = BigInt(80);
      const x2 = x * x % P;
      const b2 = x2 * x % P;
      const b4 = pow2(b2, _2n) * b2 % P;
      const b5 = pow2(b4, _1n) * x % P;
      const b10 = pow2(b5, _5n) * b5 % P;
      const b20 = pow2(b10, _10n) * b10 % P;
      const b40 = pow2(b20, _20n) * b20 % P;
      const b80 = pow2(b40, _40n) * b40 % P;
      const b160 = pow2(b80, _80n) * b80 % P;
      const b240 = pow2(b160, _80n) * b80 % P;
      const b250 = pow2(b240, _10n) * b10 % P;
      const pow_p_5_8 = pow2(b250, _2n) * x % P;
      return { pow_p_5_8, b2 };
    }
    function uvRatio(u, v2) {
      const v3 = mod2(v2 * v2 * v2);
      const v7 = mod2(v3 * v3 * v2);
      const pow = pow_2_252_3(u * v7).pow_p_5_8;
      let x = mod2(u * v3 * pow);
      const vx2 = mod2(v2 * x * x);
      const root1 = x;
      const root2 = mod2(x * SQRT_M1);
      const useRoot1 = vx2 === u;
      const useRoot2 = vx2 === mod2(-u);
      const noRoot = vx2 === mod2(-u * SQRT_M1);
      if (useRoot1)
        x = root1;
      if (useRoot2 || noRoot)
        x = root2;
      if (edIsNegative(x))
        x = mod2(-x);
      return { isValid: useRoot1 || useRoot2, value: x };
    }
    function invertSqrt(number) {
      return uvRatio(_1n, number);
    }
    function modlLE(hash) {
      return mod2(bytesToNumberLE(hash), CURVE.l);
    }
    function equalBytes(b1, b2) {
      if (b1.length !== b2.length) {
        return false;
      }
      for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    }
    function ensureBytes(hex, expectedLength) {
      const bytes = isBytes(hex) ? Uint8Array.from(hex) : hexToBytes(hex);
      if (typeof expectedLength === "number" && bytes.length !== expectedLength)
        throw new Error(`Expected ${expectedLength} bytes`);
      return bytes;
    }
    function normalizeScalar(num, max, strict = true) {
      if (!max)
        throw new TypeError("Specify max value");
      if (typeof num === "number" && Number.isSafeInteger(num))
        num = BigInt(num);
      if (typeof num === "bigint" && num < max) {
        if (strict) {
          if (_0n < num)
            return num;
        } else {
          if (_0n <= num)
            return num;
        }
      }
      throw new TypeError("Expected valid scalar: 0 < scalar < max");
    }
    function adjustBytes25519(bytes) {
      bytes[0] &= 248;
      bytes[31] &= 127;
      bytes[31] |= 64;
      return bytes;
    }
    function decodeScalar25519(n2) {
      return bytesToNumberLE(adjustBytes25519(ensureBytes(n2, 32)));
    }
    function checkPrivateKey(key) {
      key = typeof key === "bigint" || typeof key === "number" ? numberTo32BytesBE(normalizeScalar(key, POW_2_256)) : ensureBytes(key);
      if (key.length !== 32)
        throw new Error(`Expected 32 bytes`);
      return key;
    }
    function getKeyFromHash(hashed) {
      const head = adjustBytes25519(hashed.slice(0, 32));
      const prefix = hashed.slice(32, 64);
      const scalar = modlLE(head);
      const point = Point.BASE.multiply(scalar);
      const pointBytes = point.toRawBytes();
      return { head, prefix, scalar, point, pointBytes };
    }
    var _sha512Sync;
    function sha512s(...m) {
      if (typeof _sha512Sync !== "function")
        throw new Error("utils.sha512Sync must be set to use sync methods");
      return _sha512Sync(...m);
    }
    async function getExtendedPublicKey(key) {
      return getKeyFromHash(await exports2.utils.sha512(checkPrivateKey(key)));
    }
    function getExtendedPublicKeySync(key) {
      return getKeyFromHash(sha512s(checkPrivateKey(key)));
    }
    async function getPublicKey(privateKey) {
      return (await getExtendedPublicKey(privateKey)).pointBytes;
    }
    exports2.getPublicKey = getPublicKey;
    function getPublicKeySync(privateKey) {
      return getExtendedPublicKeySync(privateKey).pointBytes;
    }
    async function sign2(message, privateKey) {
      message = ensureBytes(message);
      const { prefix, scalar, pointBytes } = await getExtendedPublicKey(privateKey);
      const r = modlLE(await exports2.utils.sha512(prefix, message));
      const R = Point.BASE.multiply(r);
      const k = modlLE(await exports2.utils.sha512(R.toRawBytes(), pointBytes, message));
      const s = mod2(r + k * scalar, CURVE.l);
      return new Signature(R, s).toRawBytes();
    }
    exports2.sign = sign2;
    function signSync(message, privateKey) {
      message = ensureBytes(message);
      const { prefix, scalar, pointBytes } = getExtendedPublicKeySync(privateKey);
      const r = modlLE(sha512s(prefix, message));
      const R = Point.BASE.multiply(r);
      const k = modlLE(sha512s(R.toRawBytes(), pointBytes, message));
      const s = mod2(r + k * scalar, CURVE.l);
      return new Signature(R, s).toRawBytes();
    }
    function prepareVerification(sig, message, publicKey) {
      message = ensureBytes(message);
      if (!(publicKey instanceof Point))
        publicKey = Point.fromHex(publicKey, false);
      const { r, s } = sig instanceof Signature ? sig.assertValidity() : Signature.fromHex(sig);
      const SB = ExtendedPoint.BASE.multiplyUnsafe(s);
      return { r, s, SB, pub: publicKey, msg: message };
    }
    function finishVerification(publicKey, r, SB, hashed) {
      const k = modlLE(hashed);
      const kA = ExtendedPoint.fromAffine(publicKey).multiplyUnsafe(k);
      const RkA = ExtendedPoint.fromAffine(r).add(kA);
      return RkA.subtract(SB).multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
    }
    async function verify(sig, message, publicKey) {
      const { r, SB, msg, pub } = prepareVerification(sig, message, publicKey);
      const hashed = await exports2.utils.sha512(r.toRawBytes(), pub.toRawBytes(), msg);
      return finishVerification(pub, r, SB, hashed);
    }
    exports2.verify = verify;
    function verifySync(sig, message, publicKey) {
      const { r, SB, msg, pub } = prepareVerification(sig, message, publicKey);
      const hashed = sha512s(r.toRawBytes(), pub.toRawBytes(), msg);
      return finishVerification(pub, r, SB, hashed);
    }
    exports2.sync = {
      getExtendedPublicKey: getExtendedPublicKeySync,
      getPublicKey: getPublicKeySync,
      sign: signSync,
      verify: verifySync
    };
    async function getSharedSecret(privateKey, publicKey) {
      const { head } = await getExtendedPublicKey(privateKey);
      const u = Point.fromHex(publicKey).toX25519();
      return exports2.curve25519.scalarMult(head, u);
    }
    exports2.getSharedSecret = getSharedSecret;
    Point.BASE._setWindowSize(8);
    function cswap(swap, x_2, x_3) {
      const dummy = mod2(swap * (x_2 - x_3));
      x_2 = mod2(x_2 - dummy);
      x_3 = mod2(x_3 + dummy);
      return [x_2, x_3];
    }
    function montgomeryLadder(pointU, scalar) {
      const { P } = CURVE;
      const u = normalizeScalar(pointU, P);
      const k = normalizeScalar(scalar, P);
      const a24 = BigInt(121665);
      const x_1 = u;
      let x_2 = _1n;
      let z_2 = _0n;
      let x_3 = u;
      let z_3 = _1n;
      let swap = _0n;
      let sw;
      for (let t2 = BigInt(255 - 1); t2 >= _0n; t2--) {
        const k_t = k >> t2 & _1n;
        swap ^= k_t;
        sw = cswap(swap, x_2, x_3);
        x_2 = sw[0];
        x_3 = sw[1];
        sw = cswap(swap, z_2, z_3);
        z_2 = sw[0];
        z_3 = sw[1];
        swap = k_t;
        const A = x_2 + z_2;
        const AA = mod2(A * A);
        const B = x_2 - z_2;
        const BB = mod2(B * B);
        const E = AA - BB;
        const C = x_3 + z_3;
        const D = x_3 - z_3;
        const DA = mod2(D * A);
        const CB = mod2(C * B);
        const dacb = DA + CB;
        const da_cb = DA - CB;
        x_3 = mod2(dacb * dacb);
        z_3 = mod2(x_1 * mod2(da_cb * da_cb));
        x_2 = mod2(AA * BB);
        z_2 = mod2(E * (AA + mod2(a24 * E)));
      }
      sw = cswap(swap, x_2, x_3);
      x_2 = sw[0];
      x_3 = sw[1];
      sw = cswap(swap, z_2, z_3);
      z_2 = sw[0];
      z_3 = sw[1];
      const { pow_p_5_8, b2 } = pow_2_252_3(z_2);
      const xp2 = mod2(pow2(pow_p_5_8, BigInt(3)) * b2);
      return mod2(x_2 * xp2);
    }
    function encodeUCoordinate(u) {
      return numberTo32BytesLE(mod2(u, CURVE.P));
    }
    function decodeUCoordinate(uEnc) {
      const u = ensureBytes(uEnc, 32);
      u[31] &= 127;
      return bytesToNumberLE(u);
    }
    exports2.curve25519 = {
      BASE_POINT_U: "0900000000000000000000000000000000000000000000000000000000000000",
      scalarMult(privateKey, publicKey) {
        const u = decodeUCoordinate(publicKey);
        const p2 = decodeScalar25519(privateKey);
        const pu = montgomeryLadder(u, p2);
        if (pu === _0n)
          throw new Error("Invalid private or public key received");
        return encodeUCoordinate(pu);
      },
      scalarMultBase(privateKey) {
        return exports2.curve25519.scalarMult(privateKey, exports2.curve25519.BASE_POINT_U);
      }
    };
    var crypto3 = {
      node: nodeCrypto,
      web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
    };
    exports2.utils = {
      bytesToHex,
      hexToBytes,
      concatBytes,
      getExtendedPublicKey,
      mod: mod2,
      invert,
      TORSION_SUBGROUP: [
        "0100000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
        "0000000000000000000000000000000000000000000000000000000000000080",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
        "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
      ],
      hashToPrivateScalar: (hash) => {
        hash = ensureBytes(hash);
        if (hash.length < 40 || hash.length > 1024)
          throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
        return mod2(bytesToNumberLE(hash), CURVE.l - _1n) + _1n;
      },
      randomBytes: (bytesLength = 32) => {
        if (crypto3.web) {
          return crypto3.web.getRandomValues(new Uint8Array(bytesLength));
        } else if (crypto3.node) {
          const { randomBytes } = crypto3.node;
          return new Uint8Array(randomBytes(bytesLength).buffer);
        } else {
          throw new Error("The environment doesn't have randomBytes function");
        }
      },
      randomPrivateKey: () => {
        return exports2.utils.randomBytes(32);
      },
      sha512: async (...messages) => {
        const message = concatBytes(...messages);
        if (crypto3.web) {
          const buffer2 = await crypto3.web.subtle.digest("SHA-512", message.buffer);
          return new Uint8Array(buffer2);
        } else if (crypto3.node) {
          return Uint8Array.from(crypto3.node.createHash("sha512").update(message).digest());
        } else {
          throw new Error("The environment doesn't have sha512 function");
        }
      },
      precompute(windowSize = 8, point = Point.BASE) {
        const cached = point.equals(Point.BASE) ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(_2n);
        return cached;
      },
      sha512Sync: void 0
    };
    Object.defineProperties(exports2.utils, {
      sha512Sync: {
        configurable: false,
        get() {
          return _sha512Sync;
        },
        set(val) {
          if (!_sha512Sync)
            _sha512Sync = val;
        }
      }
    });
  }
});

// node_modules/libp2p-crypto/src/keys/ed25519.js
var require_ed25519 = __commonJS({
  "node_modules/libp2p-crypto/src/keys/ed25519.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var ed = require_lib();
    var PUBLIC_KEY_BYTE_LENGTH = 32;
    var PRIVATE_KEY_BYTE_LENGTH = 64;
    var KEYS_BYTE_LENGTH = 32;
    exports2.publicKeyLength = PUBLIC_KEY_BYTE_LENGTH;
    exports2.privateKeyLength = PRIVATE_KEY_BYTE_LENGTH;
    exports2.generateKey = async function() {
      const privateKeyRaw = ed.utils.randomPrivateKey();
      const publicKey = await ed.getPublicKey(privateKeyRaw);
      const privateKey = concatKeys(privateKeyRaw, publicKey);
      return {
        privateKey,
        publicKey
      };
    };
    exports2.generateKeyFromSeed = async function(seed) {
      if (seed.length !== KEYS_BYTE_LENGTH) {
        throw new TypeError('"seed" must be 32 bytes in length.');
      } else if (!(seed instanceof Uint8Array)) {
        throw new TypeError('"seed" must be a node.js Buffer, or Uint8Array.');
      }
      const privateKeyRaw = seed;
      const publicKey = await ed.getPublicKey(privateKeyRaw);
      const privateKey = concatKeys(privateKeyRaw, publicKey);
      return {
        privateKey,
        publicKey
      };
    };
    exports2.hashAndSign = function(privateKey, msg) {
      const privateKeyRaw = privateKey.slice(0, KEYS_BYTE_LENGTH);
      return ed.sign(msg, privateKeyRaw);
    };
    exports2.hashAndVerify = function(publicKey, sig, msg) {
      return ed.verify(sig, msg, publicKey);
    };
    function concatKeys(privateKeyRaw, publicKey) {
      const privateKey = new Uint8Array(exports2.privateKeyLength);
      for (let i = 0; i < KEYS_BYTE_LENGTH; i++) {
        privateKey[i] = privateKeyRaw[i];
        privateKey[KEYS_BYTE_LENGTH + i] = publicKey[i];
      }
      return privateKey;
    }
  }
});

// node_modules/libp2p-crypto/src/keys/ed25519-class.js
var require_ed25519_class = __commonJS({
  "node_modules/libp2p-crypto/src/keys/ed25519-class.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var errcode = require_err_code();
    var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
    var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
    var { base58btc: base58btc2 } = (init_base58(), __toCommonJS(base58_exports));
    var { identity: identity3 } = (init_identity2(), __toCommonJS(identity_exports2));
    var crypto3 = require_ed25519();
    var pbm = require_keys();
    var exporter = require_exporter();
    var Ed25519PublicKey = class {
      constructor(key) {
        this._key = ensureKey(key, crypto3.publicKeyLength);
      }
      async verify(data, sig) {
        return crypto3.hashAndVerify(this._key, sig, data);
      }
      marshal() {
        return this._key;
      }
      get bytes() {
        return pbm.PublicKey.encode({
          Type: pbm.KeyType.Ed25519,
          Data: this.marshal()
        }).finish();
      }
      equals(key) {
        return uint8ArrayEquals(this.bytes, key.bytes);
      }
      async hash() {
        const { bytes } = await sha2562.digest(this.bytes);
        return bytes;
      }
    };
    var Ed25519PrivateKey = class {
      // key       - 64 byte Uint8Array containing private key
      // publicKey - 32 byte Uint8Array containing public key
      constructor(key, publicKey) {
        this._key = ensureKey(key, crypto3.privateKeyLength);
        this._publicKey = ensureKey(publicKey, crypto3.publicKeyLength);
      }
      async sign(message) {
        return crypto3.hashAndSign(this._key, message);
      }
      get public() {
        return new Ed25519PublicKey(this._publicKey);
      }
      marshal() {
        return this._key;
      }
      get bytes() {
        return pbm.PrivateKey.encode({
          Type: pbm.KeyType.Ed25519,
          Data: this.marshal()
        }).finish();
      }
      equals(key) {
        return uint8ArrayEquals(this.bytes, key.bytes);
      }
      async hash() {
        const { bytes } = await sha2562.digest(this.bytes);
        return bytes;
      }
      /**
       * Gets the ID of the key.
       *
       * The key id is the base58 encoding of the identity multihash containing its public key.
       * The public key is a protobuf encoding containing a type and the DER encoding
       * of the PKCS SubjectPublicKeyInfo.
       *
       * @returns {Promise<string>}
       */
      async id() {
        const encoding = await identity3.digest(this.public.bytes);
        return base58btc2.encode(encoding.bytes).substring(1);
      }
      /**
       * Exports the key into a password protected `format`
       *
       * @param {string} password - The password to encrypt the key
       * @param {string} [format=libp2p-key] - The format in which to export as
       * @returns {Promise<Uint8Array>} The encrypted private key
       */
      async export(password, format = "libp2p-key") {
        if (format === "libp2p-key") {
          return exporter.export(this.bytes, password);
        } else {
          throw errcode(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
        }
      }
    };
    function unmarshalEd25519PrivateKey(bytes) {
      if (bytes.length > crypto3.privateKeyLength) {
        bytes = ensureKey(bytes, crypto3.privateKeyLength + crypto3.publicKeyLength);
        const privateKeyBytes2 = bytes.slice(0, crypto3.privateKeyLength);
        const publicKeyBytes2 = bytes.slice(crypto3.privateKeyLength, bytes.length);
        return new Ed25519PrivateKey(privateKeyBytes2, publicKeyBytes2);
      }
      bytes = ensureKey(bytes, crypto3.privateKeyLength);
      const privateKeyBytes = bytes.slice(0, crypto3.privateKeyLength);
      const publicKeyBytes = bytes.slice(crypto3.publicKeyLength);
      return new Ed25519PrivateKey(privateKeyBytes, publicKeyBytes);
    }
    function unmarshalEd25519PublicKey(bytes) {
      bytes = ensureKey(bytes, crypto3.publicKeyLength);
      return new Ed25519PublicKey(bytes);
    }
    async function generateKeyPair() {
      const { privateKey, publicKey } = await crypto3.generateKey();
      return new Ed25519PrivateKey(privateKey, publicKey);
    }
    async function generateKeyPairFromSeed(seed) {
      const { privateKey, publicKey } = await crypto3.generateKeyFromSeed(seed);
      return new Ed25519PrivateKey(privateKey, publicKey);
    }
    function ensureKey(key, length2) {
      key = Uint8Array.from(key || []);
      if (key.length !== length2) {
        throw errcode(new Error(`Key must be a Uint8Array of length ${length2}, got ${key.length}`), "ERR_INVALID_KEY_TYPE");
      }
      return key;
    }
    module2.exports = {
      Ed25519PublicKey,
      Ed25519PrivateKey,
      unmarshalEd25519PrivateKey,
      unmarshalEd25519PublicKey,
      generateKeyPair,
      generateKeyPairFromSeed
    };
  }
});

// node_modules/@noble/secp256k1/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@noble/secp256k1/lib/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.utils = exports2.schnorr = exports2.verify = exports2.signSync = exports2.sign = exports2.getSharedSecret = exports2.recoverPublicKey = exports2.getPublicKey = exports2.hexToBytes = exports2.bytesToHex = exports2.Signature = exports2.Point = exports2.CURVE = void 0;
    var nodeCrypto = require_crypto();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _3n = BigInt(3);
    var _8n = BigInt(8);
    var CURVE = Object.freeze({
      a: _0n,
      b: BigInt(7),
      P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
      n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
      h: _1n,
      Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
      Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
    });
    exports2.CURVE = CURVE;
    var divNearest = (a, b2) => (a + b2 / _2n) / b2;
    var endo = {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      splitScalar(k) {
        const { n: n2 } = CURVE;
        const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
        const b1 = -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
        const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
        const b2 = a1;
        const POW_2_128 = BigInt("0x100000000000000000000000000000000");
        const c1 = divNearest(b2 * k, n2);
        const c2 = divNearest(-b1 * k, n2);
        let k1 = mod2(k - c1 * a1 - c2 * a2, n2);
        let k2 = mod2(-c1 * b1 - c2 * b2, n2);
        const k1neg = k1 > POW_2_128;
        const k2neg = k2 > POW_2_128;
        if (k1neg)
          k1 = n2 - k1;
        if (k2neg)
          k2 = n2 - k2;
        if (k1 > POW_2_128 || k2 > POW_2_128) {
          throw new Error("splitScalarEndo: Endomorphism failed, k=" + k);
        }
        return { k1neg, k1, k2neg, k2 };
      }
    };
    var fieldLen = 32;
    var groupLen = 32;
    var hashLen = 32;
    var compressedLen = fieldLen + 1;
    var uncompressedLen = 2 * fieldLen + 1;
    function weierstrass(x) {
      const { a, b: b2 } = CURVE;
      const x2 = mod2(x * x);
      const x3 = mod2(x2 * x);
      return mod2(x3 + a * x + b2);
    }
    var USE_ENDOMORPHISM = CURVE.a === _0n;
    var ShaError = class extends Error {
      constructor(message) {
        super(message);
      }
    };
    function assertJacPoint(other) {
      if (!(other instanceof JacobianPoint))
        throw new TypeError("JacobianPoint expected");
    }
    var JacobianPoint = class _JacobianPoint {
      constructor(x, y2, z) {
        this.x = x;
        this.y = y2;
        this.z = z;
      }
      static fromAffine(p2) {
        if (!(p2 instanceof Point)) {
          throw new TypeError("JacobianPoint#fromAffine: expected Point");
        }
        if (p2.equals(Point.ZERO))
          return _JacobianPoint.ZERO;
        return new _JacobianPoint(p2.x, p2.y, _1n);
      }
      static toAffineBatch(points) {
        const toInv = invertBatch(points.map((p2) => p2.z));
        return points.map((p2, i) => p2.toAffine(toInv[i]));
      }
      static normalizeZ(points) {
        return _JacobianPoint.toAffineBatch(points).map(_JacobianPoint.fromAffine);
      }
      equals(other) {
        assertJacPoint(other);
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        const Z1Z1 = mod2(Z1 * Z1);
        const Z2Z2 = mod2(Z2 * Z2);
        const U1 = mod2(X1 * Z2Z2);
        const U2 = mod2(X2 * Z1Z1);
        const S1 = mod2(mod2(Y1 * Z2) * Z2Z2);
        const S2 = mod2(mod2(Y2 * Z1) * Z1Z1);
        return U1 === U2 && S1 === S2;
      }
      negate() {
        return new _JacobianPoint(this.x, mod2(-this.y), this.z);
      }
      double() {
        const { x: X1, y: Y1, z: Z1 } = this;
        const A = mod2(X1 * X1);
        const B = mod2(Y1 * Y1);
        const C = mod2(B * B);
        const x1b = X1 + B;
        const D = mod2(_2n * (mod2(x1b * x1b) - A - C));
        const E = mod2(_3n * A);
        const F = mod2(E * E);
        const X3 = mod2(F - _2n * D);
        const Y3 = mod2(E * (D - X3) - _8n * C);
        const Z3 = mod2(_2n * Y1 * Z1);
        return new _JacobianPoint(X3, Y3, Z3);
      }
      add(other) {
        assertJacPoint(other);
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        if (X2 === _0n || Y2 === _0n)
          return this;
        if (X1 === _0n || Y1 === _0n)
          return other;
        const Z1Z1 = mod2(Z1 * Z1);
        const Z2Z2 = mod2(Z2 * Z2);
        const U1 = mod2(X1 * Z2Z2);
        const U2 = mod2(X2 * Z1Z1);
        const S1 = mod2(mod2(Y1 * Z2) * Z2Z2);
        const S2 = mod2(mod2(Y2 * Z1) * Z1Z1);
        const H = mod2(U2 - U1);
        const r = mod2(S2 - S1);
        if (H === _0n) {
          if (r === _0n) {
            return this.double();
          } else {
            return _JacobianPoint.ZERO;
          }
        }
        const HH = mod2(H * H);
        const HHH = mod2(H * HH);
        const V = mod2(U1 * HH);
        const X3 = mod2(r * r - HHH - _2n * V);
        const Y3 = mod2(r * (V - X3) - S1 * HHH);
        const Z3 = mod2(Z1 * Z2 * H);
        return new _JacobianPoint(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      multiplyUnsafe(scalar) {
        const P0 = _JacobianPoint.ZERO;
        if (typeof scalar === "bigint" && scalar === _0n)
          return P0;
        let n2 = normalizeScalar(scalar);
        if (n2 === _1n)
          return this;
        if (!USE_ENDOMORPHISM) {
          let p2 = P0;
          let d3 = this;
          while (n2 > _0n) {
            if (n2 & _1n)
              p2 = p2.add(d3);
            d3 = d3.double();
            n2 >>= _1n;
          }
          return p2;
        }
        let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n2);
        let k1p = P0;
        let k2p = P0;
        let d2 = this;
        while (k1 > _0n || k2 > _0n) {
          if (k1 & _1n)
            k1p = k1p.add(d2);
          if (k2 & _1n)
            k2p = k2p.add(d2);
          d2 = d2.double();
          k1 >>= _1n;
          k2 >>= _1n;
        }
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new _JacobianPoint(mod2(k2p.x * endo.beta), k2p.y, k2p.z);
        return k1p.add(k2p);
      }
      precomputeWindow(W) {
        const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
        const points = [];
        let p2 = this;
        let base3 = p2;
        for (let window2 = 0; window2 < windows; window2++) {
          base3 = p2;
          points.push(base3);
          for (let i = 1; i < 2 ** (W - 1); i++) {
            base3 = base3.add(p2);
            points.push(base3);
          }
          p2 = base3.double();
        }
        return points;
      }
      wNAF(n2, affinePoint) {
        if (!affinePoint && this.equals(_JacobianPoint.BASE))
          affinePoint = Point.BASE;
        const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
        if (256 % W) {
          throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
        }
        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
        if (!precomputes) {
          precomputes = this.precomputeWindow(W);
          if (affinePoint && W !== 1) {
            precomputes = _JacobianPoint.normalizeZ(precomputes);
            pointPrecomputes.set(affinePoint, precomputes);
          }
        }
        let p2 = _JacobianPoint.ZERO;
        let f2 = _JacobianPoint.BASE;
        const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
        const windowSize = 2 ** (W - 1);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          let wbits = Number(n2 & mask);
          n2 >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n2 += _1n;
          }
          const offset1 = offset;
          const offset2 = offset + Math.abs(wbits) - 1;
          const cond1 = window2 % 2 !== 0;
          const cond2 = wbits < 0;
          if (wbits === 0) {
            f2 = f2.add(constTimeNegate(cond1, precomputes[offset1]));
          } else {
            p2 = p2.add(constTimeNegate(cond2, precomputes[offset2]));
          }
        }
        return { p: p2, f: f2 };
      }
      multiply(scalar, affinePoint) {
        let n2 = normalizeScalar(scalar);
        let point;
        let fake;
        if (USE_ENDOMORPHISM) {
          const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n2);
          let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
          let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
          k1p = constTimeNegate(k1neg, k1p);
          k2p = constTimeNegate(k2neg, k2p);
          k2p = new _JacobianPoint(mod2(k2p.x * endo.beta), k2p.y, k2p.z);
          point = k1p.add(k2p);
          fake = f1p.add(f2p);
        } else {
          const { p: p2, f: f2 } = this.wNAF(n2, affinePoint);
          point = p2;
          fake = f2;
        }
        return _JacobianPoint.normalizeZ([point, fake])[0];
      }
      toAffine(invZ) {
        const { x, y: y2, z } = this;
        const is0 = this.equals(_JacobianPoint.ZERO);
        if (invZ == null)
          invZ = is0 ? _8n : invert(z);
        const iz1 = invZ;
        const iz2 = mod2(iz1 * iz1);
        const iz3 = mod2(iz2 * iz1);
        const ax = mod2(x * iz2);
        const ay = mod2(y2 * iz3);
        const zz = mod2(z * iz1);
        if (is0)
          return Point.ZERO;
        if (zz !== _1n)
          throw new Error("invZ was invalid");
        return new Point(ax, ay);
      }
    };
    JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n);
    JacobianPoint.ZERO = new JacobianPoint(_0n, _1n, _0n);
    function constTimeNegate(condition, item) {
      const neg = item.negate();
      return condition ? neg : item;
    }
    var pointPrecomputes = /* @__PURE__ */ new WeakMap();
    var Point = class _Point {
      constructor(x, y2) {
        this.x = x;
        this.y = y2;
      }
      _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
      }
      hasEvenY() {
        return this.y % _2n === _0n;
      }
      static fromCompressedHex(bytes) {
        const isShort = bytes.length === 32;
        const x = bytesToNumber(isShort ? bytes : bytes.subarray(1));
        if (!isValidFieldElement(x))
          throw new Error("Point is not on curve");
        const y2 = weierstrass(x);
        let y3 = sqrtMod(y2);
        const isYOdd = (y3 & _1n) === _1n;
        if (isShort) {
          if (isYOdd)
            y3 = mod2(-y3);
        } else {
          const isFirstByteOdd = (bytes[0] & 1) === 1;
          if (isFirstByteOdd !== isYOdd)
            y3 = mod2(-y3);
        }
        const point = new _Point(x, y3);
        point.assertValidity();
        return point;
      }
      static fromUncompressedHex(bytes) {
        const x = bytesToNumber(bytes.subarray(1, fieldLen + 1));
        const y2 = bytesToNumber(bytes.subarray(fieldLen + 1, fieldLen * 2 + 1));
        const point = new _Point(x, y2);
        point.assertValidity();
        return point;
      }
      static fromHex(hex) {
        const bytes = ensureBytes(hex);
        const len = bytes.length;
        const header = bytes[0];
        if (len === fieldLen)
          return this.fromCompressedHex(bytes);
        if (len === compressedLen && (header === 2 || header === 3)) {
          return this.fromCompressedHex(bytes);
        }
        if (len === uncompressedLen && header === 4)
          return this.fromUncompressedHex(bytes);
        throw new Error(`Point.fromHex: received invalid point. Expected 32-${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes, not ${len}`);
      }
      static fromPrivateKey(privateKey) {
        return _Point.BASE.multiply(normalizePrivateKey(privateKey));
      }
      static fromSignature(msgHash, signature, recovery) {
        const { r, s } = normalizeSignature(signature);
        if (![0, 1, 2, 3].includes(recovery))
          throw new Error("Cannot recover: invalid recovery bit");
        const h2 = truncateHash(ensureBytes(msgHash));
        const { n: n2 } = CURVE;
        const radj = recovery === 2 || recovery === 3 ? r + n2 : r;
        const rinv = invert(radj, n2);
        const u1 = mod2(-h2 * rinv, n2);
        const u2 = mod2(s * rinv, n2);
        const prefix = recovery & 1 ? "03" : "02";
        const R = _Point.fromHex(prefix + numTo32bStr(radj));
        const Q = _Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
          throw new Error("Cannot recover signature: point at infinify");
        Q.assertValidity();
        return Q;
      }
      toRawBytes(isCompressed = false) {
        return hexToBytes(this.toHex(isCompressed));
      }
      toHex(isCompressed = false) {
        const x = numTo32bStr(this.x);
        if (isCompressed) {
          const prefix = this.hasEvenY() ? "02" : "03";
          return `${prefix}${x}`;
        } else {
          return `04${x}${numTo32bStr(this.y)}`;
        }
      }
      toHexX() {
        return this.toHex(true).slice(2);
      }
      toRawX() {
        return this.toRawBytes(true).slice(1);
      }
      assertValidity() {
        const msg = "Point is not on elliptic curve";
        const { x, y: y2 } = this;
        if (!isValidFieldElement(x) || !isValidFieldElement(y2))
          throw new Error(msg);
        const left = mod2(y2 * y2);
        const right = weierstrass(x);
        if (mod2(left - right) !== _0n)
          throw new Error(msg);
      }
      equals(other) {
        return this.x === other.x && this.y === other.y;
      }
      negate() {
        return new _Point(this.x, mod2(-this.y));
      }
      double() {
        return JacobianPoint.fromAffine(this).double().toAffine();
      }
      add(other) {
        return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
      }
      subtract(other) {
        return this.add(other.negate());
      }
      multiply(scalar) {
        return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
      }
      multiplyAndAddUnsafe(Q, a, b2) {
        const P = JacobianPoint.fromAffine(this);
        const aP = a === _0n || a === _1n || this !== _Point.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
        const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b2);
        const sum = aP.add(bQ);
        return sum.equals(JacobianPoint.ZERO) ? void 0 : sum.toAffine();
      }
    };
    exports2.Point = Point;
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
    Point.ZERO = new Point(_0n, _0n);
    function sliceDER(s) {
      return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
    }
    function parseDERInt(data) {
      if (data.length < 2 || data[0] !== 2) {
        throw new Error(`Invalid signature integer tag: ${bytesToHex(data)}`);
      }
      const len = data[1];
      const res = data.subarray(2, len + 2);
      if (!len || res.length !== len) {
        throw new Error(`Invalid signature integer: wrong length`);
      }
      if (res[0] === 0 && res[1] <= 127) {
        throw new Error("Invalid signature integer: trailing length");
      }
      return { data: bytesToNumber(res), left: data.subarray(len + 2) };
    }
    function parseDERSignature(data) {
      if (data.length < 2 || data[0] != 48) {
        throw new Error(`Invalid signature tag: ${bytesToHex(data)}`);
      }
      if (data[1] !== data.length - 2) {
        throw new Error("Invalid signature: incorrect length");
      }
      const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
      const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
      if (rBytesLeft.length) {
        throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex(rBytesLeft)}`);
      }
      return { r, s };
    }
    var Signature = class _Signature {
      constructor(r, s) {
        this.r = r;
        this.s = s;
        this.assertValidity();
      }
      static fromCompact(hex) {
        const arr = isBytes(hex);
        const name2 = "Signature.fromCompact";
        if (typeof hex !== "string" && !arr)
          throw new TypeError(`${name2}: Expected string or Uint8Array`);
        const str = arr ? bytesToHex(hex) : hex;
        if (str.length !== 128)
          throw new Error(`${name2}: Expected 64-byte hex`);
        return new _Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
      }
      static fromDER(hex) {
        const arr = isBytes(hex);
        if (typeof hex !== "string" && !arr)
          throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
        const { r, s } = parseDERSignature(arr ? hex : hexToBytes(hex));
        return new _Signature(r, s);
      }
      static fromHex(hex) {
        return this.fromDER(hex);
      }
      assertValidity() {
        const { r, s } = this;
        if (!isWithinCurveOrder(r))
          throw new Error("Invalid Signature: r must be 0 < r < n");
        if (!isWithinCurveOrder(s))
          throw new Error("Invalid Signature: s must be 0 < s < n");
      }
      hasHighS() {
        const HALF = CURVE.n >> _1n;
        return this.s > HALF;
      }
      normalizeS() {
        return this.hasHighS() ? new _Signature(this.r, mod2(-this.s, CURVE.n)) : this;
      }
      toDERRawBytes() {
        return hexToBytes(this.toDERHex());
      }
      toDERHex() {
        const sHex = sliceDER(numberToHexUnpadded(this.s));
        const rHex = sliceDER(numberToHexUnpadded(this.r));
        const sHexL = sHex.length / 2;
        const rHexL = rHex.length / 2;
        const sLen = numberToHexUnpadded(sHexL);
        const rLen = numberToHexUnpadded(rHexL);
        const length2 = numberToHexUnpadded(rHexL + sHexL + 4);
        return `30${length2}02${rLen}${rHex}02${sLen}${sHex}`;
      }
      toRawBytes() {
        return this.toDERRawBytes();
      }
      toHex() {
        return this.toDERHex();
      }
      toCompactRawBytes() {
        return hexToBytes(this.toCompactHex());
      }
      toCompactHex() {
        return numTo32bStr(this.r) + numTo32bStr(this.s);
      }
    };
    exports2.Signature = Signature;
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function abytes(item) {
      if (!isBytes(item))
        throw new Error("Uint8Array expected");
    }
    function concatBytes(...arrays) {
      arrays.every(abytes);
      if (arrays.length === 1)
        return arrays[0];
      const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
      const result = new Uint8Array(length2);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
      }
      return result;
    }
    var hexes = Array.from({ length: 256 }, (_2, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    exports2.bytesToHex = bytesToHex;
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    exports2.hexToBytes = hexToBytes;
    var POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
    function numTo32bStr(num) {
      if (typeof num !== "bigint")
        throw new Error("Expected bigint");
      if (!(_0n <= num && num < POW_2_256))
        throw new Error("Expected number 0 <= n < 2^256");
      return num.toString(16).padStart(64, "0");
    }
    function numTo32b(num) {
      const b2 = hexToBytes(numTo32bStr(num));
      if (b2.length !== 32)
        throw new Error("Error: expected 32 bytes");
      return b2;
    }
    function numberToHexUnpadded(num) {
      const hex = num.toString(16);
      return hex.length & 1 ? `0${hex}` : hex;
    }
    function hexToNumber(hex) {
      if (typeof hex !== "string") {
        throw new TypeError("hexToNumber: expected string, got " + typeof hex);
      }
      return BigInt(`0x${hex}`);
    }
    function bytesToNumber(bytes) {
      return hexToNumber(bytesToHex(bytes));
    }
    function ensureBytes(hex) {
      return isBytes(hex) ? Uint8Array.from(hex) : hexToBytes(hex);
    }
    function normalizeScalar(num) {
      if (typeof num === "number" && Number.isSafeInteger(num) && num > 0)
        return BigInt(num);
      if (typeof num === "bigint" && isWithinCurveOrder(num))
        return num;
      throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
    }
    function mod2(a, b2 = CURVE.P) {
      const result = a % b2;
      return result >= _0n ? result : b2 + result;
    }
    function pow2(x, power) {
      const { P } = CURVE;
      let res = x;
      while (power-- > _0n) {
        res *= res;
        res %= P;
      }
      return res;
    }
    function sqrtMod(x) {
      const { P } = CURVE;
      const _6n = BigInt(6);
      const _11n = BigInt(11);
      const _22n = BigInt(22);
      const _23n = BigInt(23);
      const _44n = BigInt(44);
      const _88n = BigInt(88);
      const b2 = x * x * x % P;
      const b3 = b2 * b2 * x % P;
      const b6 = pow2(b3, _3n) * b3 % P;
      const b9 = pow2(b6, _3n) * b3 % P;
      const b11 = pow2(b9, _2n) * b2 % P;
      const b22 = pow2(b11, _11n) * b11 % P;
      const b44 = pow2(b22, _22n) * b22 % P;
      const b88 = pow2(b44, _44n) * b44 % P;
      const b176 = pow2(b88, _88n) * b88 % P;
      const b220 = pow2(b176, _44n) * b44 % P;
      const b223 = pow2(b220, _3n) * b3 % P;
      const t1 = pow2(b223, _23n) * b22 % P;
      const t2 = pow2(t1, _6n) * b2 % P;
      const rt = pow2(t2, _2n);
      const xc = rt * rt % P;
      if (xc !== x)
        throw new Error("Cannot find square root");
      return rt;
    }
    function invert(number, modulo = CURVE.P) {
      if (number === _0n || modulo <= _0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
      }
      let a = mod2(number, modulo);
      let b2 = modulo;
      let x = _0n, y2 = _1n, u = _1n, v2 = _0n;
      while (a !== _0n) {
        const q2 = b2 / a;
        const r = b2 % a;
        const m = x - u * q2;
        const n2 = y2 - v2 * q2;
        b2 = a, a = r, x = u, y2 = v2, u = m, v2 = n2;
      }
      const gcd = b2;
      if (gcd !== _1n)
        throw new Error("invert: does not exist");
      return mod2(x, modulo);
    }
    function invertBatch(nums, p2 = CURVE.P) {
      const scratch = new Array(nums.length);
      const lastMultiplied = nums.reduce((acc, num, i) => {
        if (num === _0n)
          return acc;
        scratch[i] = acc;
        return mod2(acc * num, p2);
      }, _1n);
      const inverted = invert(lastMultiplied, p2);
      nums.reduceRight((acc, num, i) => {
        if (num === _0n)
          return acc;
        scratch[i] = mod2(acc * scratch[i], p2);
        return mod2(acc * num, p2);
      }, inverted);
      return scratch;
    }
    function bits2int_2(bytes) {
      const delta = bytes.length * 8 - groupLen * 8;
      const num = bytesToNumber(bytes);
      return delta > 0 ? num >> BigInt(delta) : num;
    }
    function truncateHash(hash, truncateOnly = false) {
      const h2 = bits2int_2(hash);
      if (truncateOnly)
        return h2;
      const { n: n2 } = CURVE;
      return h2 >= n2 ? h2 - n2 : h2;
    }
    var _sha256Sync;
    var _hmacSha256Sync;
    var HmacDrbg = class {
      constructor(hashLen2, qByteLen) {
        this.hashLen = hashLen2;
        this.qByteLen = qByteLen;
        if (typeof hashLen2 !== "number" || hashLen2 < 2)
          throw new Error("hashLen must be a number");
        if (typeof qByteLen !== "number" || qByteLen < 2)
          throw new Error("qByteLen must be a number");
        this.v = new Uint8Array(hashLen2).fill(1);
        this.k = new Uint8Array(hashLen2).fill(0);
        this.counter = 0;
      }
      hmac(...values) {
        return exports2.utils.hmacSha256(this.k, ...values);
      }
      hmacSync(...values) {
        return _hmacSha256Sync(this.k, ...values);
      }
      checkSync() {
        if (typeof _hmacSha256Sync !== "function")
          throw new ShaError("hmacSha256Sync needs to be set");
      }
      incr() {
        if (this.counter >= 1e3)
          throw new Error("Tried 1,000 k values for sign(), all were invalid");
        this.counter += 1;
      }
      async reseed(seed = new Uint8Array()) {
        this.k = await this.hmac(this.v, Uint8Array.from([0]), seed);
        this.v = await this.hmac(this.v);
        if (seed.length === 0)
          return;
        this.k = await this.hmac(this.v, Uint8Array.from([1]), seed);
        this.v = await this.hmac(this.v);
      }
      reseedSync(seed = new Uint8Array()) {
        this.checkSync();
        this.k = this.hmacSync(this.v, Uint8Array.from([0]), seed);
        this.v = this.hmacSync(this.v);
        if (seed.length === 0)
          return;
        this.k = this.hmacSync(this.v, Uint8Array.from([1]), seed);
        this.v = this.hmacSync(this.v);
      }
      async generate() {
        this.incr();
        let len = 0;
        const out = [];
        while (len < this.qByteLen) {
          this.v = await this.hmac(this.v);
          const sl = this.v.slice();
          out.push(sl);
          len += this.v.length;
        }
        return concatBytes(...out);
      }
      generateSync() {
        this.checkSync();
        this.incr();
        let len = 0;
        const out = [];
        while (len < this.qByteLen) {
          this.v = this.hmacSync(this.v);
          const sl = this.v.slice();
          out.push(sl);
          len += this.v.length;
        }
        return concatBytes(...out);
      }
    };
    function isWithinCurveOrder(num) {
      return _0n < num && num < CURVE.n;
    }
    function isValidFieldElement(num) {
      return _0n < num && num < CURVE.P;
    }
    function kmdToSig(kBytes, m, d2, lowS = true) {
      const { n: n2 } = CURVE;
      const k = truncateHash(kBytes, true);
      if (!isWithinCurveOrder(k))
        return;
      const kinv = invert(k, n2);
      const q2 = Point.BASE.multiply(k);
      const r = mod2(q2.x, n2);
      if (r === _0n)
        return;
      const s = mod2(kinv * mod2(m + d2 * r, n2), n2);
      if (s === _0n)
        return;
      let sig = new Signature(r, s);
      let recovery = (q2.x === sig.r ? 0 : 2) | Number(q2.y & _1n);
      if (lowS && sig.hasHighS()) {
        sig = sig.normalizeS();
        recovery ^= 1;
      }
      return { sig, recovery };
    }
    function normalizePrivateKey(key) {
      let num;
      if (typeof key === "bigint") {
        num = key;
      } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
        num = BigInt(key);
      } else if (typeof key === "string") {
        if (key.length !== 2 * groupLen)
          throw new Error("Expected 32 bytes of private key");
        num = hexToNumber(key);
      } else if (isBytes(key)) {
        if (key.length !== groupLen)
          throw new Error("Expected 32 bytes of private key");
        num = bytesToNumber(key);
      } else {
        throw new TypeError("Expected valid private key");
      }
      if (!isWithinCurveOrder(num))
        throw new Error("Expected private key: 0 < key < n");
      return num;
    }
    function normalizePublicKey(publicKey) {
      if (publicKey instanceof Point) {
        publicKey.assertValidity();
        return publicKey;
      } else {
        return Point.fromHex(publicKey);
      }
    }
    function normalizeSignature(signature) {
      if (signature instanceof Signature) {
        signature.assertValidity();
        return signature;
      }
      try {
        return Signature.fromDER(signature);
      } catch (error) {
        return Signature.fromCompact(signature);
      }
    }
    function getPublicKey(privateKey, isCompressed = false) {
      return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    exports2.getPublicKey = getPublicKey;
    function recoverPublicKey(msgHash, signature, recovery, isCompressed = false) {
      return Point.fromSignature(msgHash, signature, recovery).toRawBytes(isCompressed);
    }
    exports2.recoverPublicKey = recoverPublicKey;
    function isProbPub(item) {
      const arr = isBytes(item);
      const str = typeof item === "string";
      const len = (arr || str) && item.length;
      if (arr)
        return len === compressedLen || len === uncompressedLen;
      if (str)
        return len === compressedLen * 2 || len === uncompressedLen * 2;
      if (item instanceof Point)
        return true;
      return false;
    }
    function getSharedSecret(privateA, publicB, isCompressed = false) {
      if (isProbPub(privateA))
        throw new TypeError("getSharedSecret: first arg must be private key");
      if (!isProbPub(publicB))
        throw new TypeError("getSharedSecret: second arg must be public key");
      const b2 = normalizePublicKey(publicB);
      b2.assertValidity();
      return b2.multiply(normalizePrivateKey(privateA)).toRawBytes(isCompressed);
    }
    exports2.getSharedSecret = getSharedSecret;
    function bits2int(bytes) {
      const slice2 = bytes.length > fieldLen ? bytes.slice(0, fieldLen) : bytes;
      return bytesToNumber(slice2);
    }
    function bits2octets(bytes) {
      const z1 = bits2int(bytes);
      const z2 = mod2(z1, CURVE.n);
      return int2octets(z2 < _0n ? z1 : z2);
    }
    function int2octets(num) {
      return numTo32b(num);
    }
    function initSigArgs(msgHash, privateKey, extraEntropy) {
      if (msgHash == null)
        throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
      const h1 = ensureBytes(msgHash);
      const d2 = normalizePrivateKey(privateKey);
      const seedArgs = [int2octets(d2), bits2octets(h1)];
      if (extraEntropy != null) {
        if (extraEntropy === true)
          extraEntropy = exports2.utils.randomBytes(fieldLen);
        const e2 = ensureBytes(extraEntropy);
        if (e2.length !== fieldLen)
          throw new Error(`sign: Expected ${fieldLen} bytes of extra data`);
        seedArgs.push(e2);
      }
      const seed = concatBytes(...seedArgs);
      const m = bits2int(h1);
      return { seed, m, d: d2 };
    }
    function finalizeSig(recSig, opts) {
      const { sig, recovery } = recSig;
      const { der, recovered } = Object.assign({ canonical: true, der: true }, opts);
      const hashed = der ? sig.toDERRawBytes() : sig.toCompactRawBytes();
      return recovered ? [hashed, recovery] : hashed;
    }
    async function sign2(msgHash, privKey, opts = {}) {
      const { seed, m, d: d2 } = initSigArgs(msgHash, privKey, opts.extraEntropy);
      const drbg = new HmacDrbg(hashLen, groupLen);
      await drbg.reseed(seed);
      let sig;
      while (!(sig = kmdToSig(await drbg.generate(), m, d2, opts.canonical)))
        await drbg.reseed();
      return finalizeSig(sig, opts);
    }
    exports2.sign = sign2;
    function signSync(msgHash, privKey, opts = {}) {
      const { seed, m, d: d2 } = initSigArgs(msgHash, privKey, opts.extraEntropy);
      const drbg = new HmacDrbg(hashLen, groupLen);
      drbg.reseedSync(seed);
      let sig;
      while (!(sig = kmdToSig(drbg.generateSync(), m, d2, opts.canonical)))
        drbg.reseedSync();
      return finalizeSig(sig, opts);
    }
    exports2.signSync = signSync;
    var vopts = { strict: true };
    function verify(signature, msgHash, publicKey, opts = vopts) {
      let sig;
      try {
        sig = normalizeSignature(signature);
        msgHash = ensureBytes(msgHash);
      } catch (error) {
        return false;
      }
      const { r, s } = sig;
      if (opts.strict && sig.hasHighS())
        return false;
      const h2 = truncateHash(msgHash);
      let P;
      try {
        P = normalizePublicKey(publicKey);
      } catch (error) {
        return false;
      }
      const { n: n2 } = CURVE;
      const sinv = invert(s, n2);
      const u1 = mod2(h2 * sinv, n2);
      const u2 = mod2(r * sinv, n2);
      const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2);
      if (!R)
        return false;
      const v2 = mod2(R.x, n2);
      return v2 === r;
    }
    exports2.verify = verify;
    function schnorrChallengeFinalize(ch) {
      return mod2(bytesToNumber(ch), CURVE.n);
    }
    var SchnorrSignature = class _SchnorrSignature {
      constructor(r, s) {
        this.r = r;
        this.s = s;
        this.assertValidity();
      }
      static fromHex(hex) {
        const bytes = ensureBytes(hex);
        if (bytes.length !== 64)
          throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${bytes.length}`);
        const r = bytesToNumber(bytes.subarray(0, 32));
        const s = bytesToNumber(bytes.subarray(32, 64));
        return new _SchnorrSignature(r, s);
      }
      assertValidity() {
        const { r, s } = this;
        if (!isValidFieldElement(r) || !isWithinCurveOrder(s))
          throw new Error("Invalid signature");
      }
      toHex() {
        return numTo32bStr(this.r) + numTo32bStr(this.s);
      }
      toRawBytes() {
        return hexToBytes(this.toHex());
      }
    };
    function schnorrGetPublicKey(privateKey) {
      return Point.fromPrivateKey(privateKey).toRawX();
    }
    var InternalSchnorrSignature = class {
      constructor(message, privateKey, auxRand = exports2.utils.randomBytes()) {
        if (message == null)
          throw new TypeError(`sign: Expected valid message, not "${message}"`);
        this.m = ensureBytes(message);
        const { x, scalar } = this.getScalar(normalizePrivateKey(privateKey));
        this.px = x;
        this.d = scalar;
        this.rand = ensureBytes(auxRand);
        if (this.rand.length !== 32)
          throw new TypeError("sign: Expected 32 bytes of aux randomness");
      }
      getScalar(priv) {
        const point = Point.fromPrivateKey(priv);
        const scalar = point.hasEvenY() ? priv : CURVE.n - priv;
        return { point, scalar, x: point.toRawX() };
      }
      initNonce(d2, t0h) {
        return numTo32b(d2 ^ bytesToNumber(t0h));
      }
      finalizeNonce(k0h) {
        const k0 = mod2(bytesToNumber(k0h), CURVE.n);
        if (k0 === _0n)
          throw new Error("sign: Creation of signature failed. k is zero");
        const { point: R, x: rx, scalar: k } = this.getScalar(k0);
        return { R, rx, k };
      }
      finalizeSig(R, k, e2, d2) {
        return new SchnorrSignature(R.x, mod2(k + e2 * d2, CURVE.n)).toRawBytes();
      }
      error() {
        throw new Error("sign: Invalid signature produced");
      }
      async calc() {
        const { m, d: d2, px, rand } = this;
        const tag = exports2.utils.taggedHash;
        const t2 = this.initNonce(d2, await tag(TAGS.aux, rand));
        const { R, rx, k } = this.finalizeNonce(await tag(TAGS.nonce, t2, px, m));
        const e2 = schnorrChallengeFinalize(await tag(TAGS.challenge, rx, px, m));
        const sig = this.finalizeSig(R, k, e2, d2);
        if (!await schnorrVerify(sig, m, px))
          this.error();
        return sig;
      }
      calcSync() {
        const { m, d: d2, px, rand } = this;
        const tag = exports2.utils.taggedHashSync;
        const t2 = this.initNonce(d2, tag(TAGS.aux, rand));
        const { R, rx, k } = this.finalizeNonce(tag(TAGS.nonce, t2, px, m));
        const e2 = schnorrChallengeFinalize(tag(TAGS.challenge, rx, px, m));
        const sig = this.finalizeSig(R, k, e2, d2);
        if (!schnorrVerifySync(sig, m, px))
          this.error();
        return sig;
      }
    };
    async function schnorrSign(msg, privKey, auxRand) {
      return new InternalSchnorrSignature(msg, privKey, auxRand).calc();
    }
    function schnorrSignSync(msg, privKey, auxRand) {
      return new InternalSchnorrSignature(msg, privKey, auxRand).calcSync();
    }
    function initSchnorrVerify(signature, message, publicKey) {
      const raw = signature instanceof SchnorrSignature;
      const sig = raw ? signature : SchnorrSignature.fromHex(signature);
      if (raw)
        sig.assertValidity();
      return {
        ...sig,
        m: ensureBytes(message),
        P: normalizePublicKey(publicKey)
      };
    }
    function finalizeSchnorrVerify(r, P, s, e2) {
      const R = Point.BASE.multiplyAndAddUnsafe(P, normalizePrivateKey(s), mod2(-e2, CURVE.n));
      if (!R || !R.hasEvenY() || R.x !== r)
        return false;
      return true;
    }
    async function schnorrVerify(signature, message, publicKey) {
      try {
        const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
        const e2 = schnorrChallengeFinalize(await exports2.utils.taggedHash(TAGS.challenge, numTo32b(r), P.toRawX(), m));
        return finalizeSchnorrVerify(r, P, s, e2);
      } catch (error) {
        return false;
      }
    }
    function schnorrVerifySync(signature, message, publicKey) {
      try {
        const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
        const e2 = schnorrChallengeFinalize(exports2.utils.taggedHashSync(TAGS.challenge, numTo32b(r), P.toRawX(), m));
        return finalizeSchnorrVerify(r, P, s, e2);
      } catch (error) {
        if (error instanceof ShaError)
          throw error;
        return false;
      }
    }
    exports2.schnorr = {
      Signature: SchnorrSignature,
      getPublicKey: schnorrGetPublicKey,
      sign: schnorrSign,
      verify: schnorrVerify,
      signSync: schnorrSignSync,
      verifySync: schnorrVerifySync
    };
    Point.BASE._setWindowSize(8);
    var crypto3 = {
      node: nodeCrypto,
      web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
    };
    var TAGS = {
      challenge: "BIP0340/challenge",
      aux: "BIP0340/aux",
      nonce: "BIP0340/nonce"
    };
    var TAGGED_HASH_PREFIXES = {};
    exports2.utils = {
      bytesToHex,
      hexToBytes,
      concatBytes,
      mod: mod2,
      invert,
      isValidPrivateKey(privateKey) {
        try {
          normalizePrivateKey(privateKey);
          return true;
        } catch (error) {
          return false;
        }
      },
      _bigintTo32Bytes: numTo32b,
      _normalizePrivateKey: normalizePrivateKey,
      hashToPrivateKey: (hash) => {
        hash = ensureBytes(hash);
        const minLen = groupLen + 8;
        if (hash.length < minLen || hash.length > 1024) {
          throw new Error(`Expected valid bytes of private key as per FIPS 186`);
        }
        const num = mod2(bytesToNumber(hash), CURVE.n - _1n) + _1n;
        return numTo32b(num);
      },
      randomBytes: (bytesLength = 32) => {
        if (crypto3.web) {
          return crypto3.web.getRandomValues(new Uint8Array(bytesLength));
        } else if (crypto3.node) {
          const { randomBytes } = crypto3.node;
          return Uint8Array.from(randomBytes(bytesLength));
        } else {
          throw new Error("The environment doesn't have randomBytes function");
        }
      },
      randomPrivateKey: () => exports2.utils.hashToPrivateKey(exports2.utils.randomBytes(groupLen + 8)),
      precompute(windowSize = 8, point = Point.BASE) {
        const cached = point === Point.BASE ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(_3n);
        return cached;
      },
      sha256: async (...messages) => {
        if (crypto3.web) {
          const buffer2 = await crypto3.web.subtle.digest("SHA-256", concatBytes(...messages));
          return new Uint8Array(buffer2);
        } else if (crypto3.node) {
          const { createHash } = crypto3.node;
          const hash = createHash("sha256");
          messages.forEach((m) => hash.update(m));
          return Uint8Array.from(hash.digest());
        } else {
          throw new Error("The environment doesn't have sha256 function");
        }
      },
      hmacSha256: async (key, ...messages) => {
        if (crypto3.web) {
          const ckey = await crypto3.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
          const message = concatBytes(...messages);
          const buffer2 = await crypto3.web.subtle.sign("HMAC", ckey, message);
          return new Uint8Array(buffer2);
        } else if (crypto3.node) {
          const { createHmac } = crypto3.node;
          const hash = createHmac("sha256", key);
          messages.forEach((m) => hash.update(m));
          return Uint8Array.from(hash.digest());
        } else {
          throw new Error("The environment doesn't have hmac-sha256 function");
        }
      },
      sha256Sync: void 0,
      hmacSha256Sync: void 0,
      taggedHash: async (tag, ...messages) => {
        let tagP = TAGGED_HASH_PREFIXES[tag];
        if (tagP === void 0) {
          const tagH = await exports2.utils.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
          tagP = concatBytes(tagH, tagH);
          TAGGED_HASH_PREFIXES[tag] = tagP;
        }
        return exports2.utils.sha256(tagP, ...messages);
      },
      taggedHashSync: (tag, ...messages) => {
        if (typeof _sha256Sync !== "function")
          throw new ShaError("sha256Sync is undefined, you need to set it");
        let tagP = TAGGED_HASH_PREFIXES[tag];
        if (tagP === void 0) {
          const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
          tagP = concatBytes(tagH, tagH);
          TAGGED_HASH_PREFIXES[tag] = tagP;
        }
        return _sha256Sync(tagP, ...messages);
      },
      _JacobianPoint: JacobianPoint
    };
    Object.defineProperties(exports2.utils, {
      sha256Sync: {
        configurable: false,
        get() {
          return _sha256Sync;
        },
        set(val) {
          if (!_sha256Sync)
            _sha256Sync = val;
        }
      },
      hmacSha256Sync: {
        configurable: false,
        get() {
          return _hmacSha256Sync;
        },
        set(val) {
          if (!_hmacSha256Sync)
            _hmacSha256Sync = val;
        }
      }
    });
  }
});

// node_modules/libp2p-crypto/src/keys/secp256k1.js
var require_secp256k1 = __commonJS({
  "node_modules/libp2p-crypto/src/keys/secp256k1.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var errcode = require_err_code();
    var secp = require_lib2();
    var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
    module2.exports = () => {
      const privateKeyLength = 32;
      function generateKey() {
        return secp.utils.randomPrivateKey();
      }
      async function hashAndSign(key, msg) {
        const { digest: digest2 } = await sha2562.digest(msg);
        try {
          return await secp.sign(digest2, key);
        } catch (err) {
          throw errcode(err, "ERR_INVALID_INPUT");
        }
      }
      async function hashAndVerify(key, sig, msg) {
        try {
          const { digest: digest2 } = await sha2562.digest(msg);
          return secp.verify(sig, digest2, key);
        } catch (err) {
          throw errcode(err, "ERR_INVALID_INPUT");
        }
      }
      function compressPublicKey(key) {
        const point = secp.Point.fromHex(key).toRawBytes(true);
        return point;
      }
      function decompressPublicKey(key) {
        const point = secp.Point.fromHex(key).toRawBytes(false);
        return point;
      }
      function validatePrivateKey(key) {
        try {
          secp.getPublicKey(key, true);
        } catch (err) {
          throw errcode(err, "ERR_INVALID_PRIVATE_KEY");
        }
      }
      function validatePublicKey(key) {
        try {
          secp.Point.fromHex(key);
        } catch (err) {
          throw errcode(err, "ERR_INVALID_PUBLIC_KEY");
        }
      }
      function computePublicKey(privateKey) {
        try {
          return secp.getPublicKey(privateKey, true);
        } catch (err) {
          throw errcode(err, "ERR_INVALID_PRIVATE_KEY");
        }
      }
      return {
        generateKey,
        privateKeyLength,
        hashAndSign,
        hashAndVerify,
        compressPublicKey,
        decompressPublicKey,
        validatePrivateKey,
        validatePublicKey,
        computePublicKey
      };
    };
  }
});

// node_modules/libp2p-crypto/src/keys/secp256k1-class.js
var require_secp256k1_class = __commonJS({
  "node_modules/libp2p-crypto/src/keys/secp256k1-class.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var { sha256: sha2562 } = (init_sha2_browser(), __toCommonJS(sha2_browser_exports));
    var errcode = require_err_code();
    var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    var exporter = require_exporter();
    module2.exports = (keysProtobuf, randomBytes, crypto3) => {
      crypto3 = crypto3 || require_secp256k1()();
      class Secp256k1PublicKey {
        constructor(key) {
          crypto3.validatePublicKey(key);
          this._key = key;
        }
        verify(data, sig) {
          return crypto3.hashAndVerify(this._key, sig, data);
        }
        marshal() {
          return crypto3.compressPublicKey(this._key);
        }
        get bytes() {
          return keysProtobuf.PublicKey.encode({
            Type: keysProtobuf.KeyType.Secp256k1,
            Data: this.marshal()
          }).finish();
        }
        equals(key) {
          return uint8ArrayEquals(this.bytes, key.bytes);
        }
        async hash() {
          const { bytes } = await sha2562.digest(this.bytes);
          return bytes;
        }
      }
      class Secp256k1PrivateKey {
        constructor(key, publicKey) {
          this._key = key;
          this._publicKey = publicKey || crypto3.computePublicKey(key);
          crypto3.validatePrivateKey(this._key);
          crypto3.validatePublicKey(this._publicKey);
        }
        sign(message) {
          return crypto3.hashAndSign(this._key, message);
        }
        get public() {
          return new Secp256k1PublicKey(this._publicKey);
        }
        marshal() {
          return this._key;
        }
        get bytes() {
          return keysProtobuf.PrivateKey.encode({
            Type: keysProtobuf.KeyType.Secp256k1,
            Data: this.marshal()
          }).finish();
        }
        equals(key) {
          return uint8ArrayEquals(this.bytes, key.bytes);
        }
        async hash() {
          const { bytes } = await sha2562.digest(this.bytes);
          return bytes;
        }
        /**
         * Gets the ID of the key.
         *
         * The key id is the base58 encoding of the SHA-256 multihash of its public key.
         * The public key is a protobuf encoding containing a type and the DER encoding
         * of the PKCS SubjectPublicKeyInfo.
         *
         * @returns {Promise<string>}
         */
        async id() {
          const hash = await this.public.hash();
          return uint8ArrayToString(hash, "base58btc");
        }
        /**
         * Exports the key into a password protected `format`
         *
         * @param {string} password - The password to encrypt the key
         * @param {string} [format=libp2p-key] - The format in which to export as
         * @returns {Promise<string>} The encrypted private key
         */
        async export(password, format = "libp2p-key") {
          if (format === "libp2p-key") {
            return exporter.export(this.bytes, password);
          } else {
            throw errcode(new Error(`export format '${format}' is not supported`), "ERR_INVALID_EXPORT_FORMAT");
          }
        }
      }
      function unmarshalSecp256k1PrivateKey(bytes) {
        return new Secp256k1PrivateKey(bytes);
      }
      function unmarshalSecp256k1PublicKey(bytes) {
        return new Secp256k1PublicKey(bytes);
      }
      async function generateKeyPair() {
        const privateKeyBytes = await crypto3.generateKey();
        return new Secp256k1PrivateKey(privateKeyBytes);
      }
      return {
        Secp256k1PublicKey,
        Secp256k1PrivateKey,
        unmarshalSecp256k1PrivateKey,
        unmarshalSecp256k1PublicKey,
        generateKeyPair
      };
    };
  }
});

// node_modules/libp2p-crypto/src/keys/key-stretcher.js
var require_key_stretcher = __commonJS({
  "node_modules/libp2p-crypto/src/keys/key-stretcher.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var errcode = require_err_code();
    var { concat: uint8ArrayConcat } = (init_concat(), __toCommonJS(concat_exports));
    var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
    var hmac = require_index_browser();
    var cipherMap = {
      "AES-128": {
        ivSize: 16,
        keySize: 16
      },
      "AES-256": {
        ivSize: 16,
        keySize: 32
      },
      Blowfish: {
        ivSize: 8,
        cipherKeySize: 32
      }
    };
    module2.exports = async (cipherType, hash, secret) => {
      const cipher = cipherMap[cipherType];
      if (!cipher) {
        const allowed = Object.keys(cipherMap).join(" / ");
        throw errcode(new Error(`unknown cipher type '${cipherType}'. Must be ${allowed}`), "ERR_INVALID_CIPHER_TYPE");
      }
      if (!hash) {
        throw errcode(new Error("missing hash type"), "ERR_MISSING_HASH_TYPE");
      }
      const cipherKeySize = cipher.keySize;
      const ivSize = cipher.ivSize;
      const hmacKeySize = 20;
      const seed = uint8ArrayFromString("key expansion");
      const resultLength = 2 * (ivSize + cipherKeySize + hmacKeySize);
      const m = await hmac.create(hash, secret);
      let a = await m.digest(seed);
      const result = [];
      let j = 0;
      while (j < resultLength) {
        const b2 = await m.digest(uint8ArrayConcat([a, seed]));
        let todo = b2.length;
        if (j + todo > resultLength) {
          todo = resultLength - j;
        }
        result.push(b2);
        j += todo;
        a = await m.digest(a);
      }
      const half = resultLength / 2;
      const resultBuffer = uint8ArrayConcat(result);
      const r1 = resultBuffer.slice(0, half);
      const r2 = resultBuffer.slice(half, resultLength);
      const createKey = (res) => ({
        iv: res.slice(0, ivSize),
        cipherKey: res.slice(ivSize, ivSize + cipherKeySize),
        macKey: res.slice(ivSize + cipherKeySize)
      });
      return {
        k1: createKey(r1),
        k2: createKey(r2)
      };
    };
  }
});

// node_modules/libp2p-crypto/src/keys/validate-curve-type.js
var require_validate_curve_type = __commonJS({
  "node_modules/libp2p-crypto/src/keys/validate-curve-type.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var errcode = require_err_code();
    module2.exports = function(curveTypes, type) {
      if (!curveTypes.includes(type)) {
        const names = curveTypes.join(" / ");
        throw errcode(new Error(`Unknown curve: ${type}. Must be ${names}`), "ERR_INVALID_CURVE");
      }
    };
  }
});

// node_modules/libp2p-crypto/src/keys/ecdh-browser.js
var require_ecdh_browser = __commonJS({
  "node_modules/libp2p-crypto/src/keys/ecdh-browser.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var errcode = require_err_code();
    var webcrypto = require_webcrypto();
    var { base64urlToBuffer } = require_util2();
    var validateCurveType = require_validate_curve_type();
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    var { concat: uint8ArrayConcat } = (init_concat(), __toCommonJS(concat_exports));
    var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
    var bits = {
      "P-256": 256,
      "P-384": 384,
      "P-521": 521
    };
    exports2.generateEphmeralKeyPair = async function(curve) {
      validateCurveType(Object.keys(bits), curve);
      const pair = await webcrypto.get().subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: curve
        },
        true,
        ["deriveBits"]
      );
      const genSharedKey = async (theirPub, forcePrivate) => {
        let privateKey;
        if (forcePrivate) {
          privateKey = await webcrypto.get().subtle.importKey(
            "jwk",
            unmarshalPrivateKey(curve, forcePrivate),
            {
              name: "ECDH",
              namedCurve: curve
            },
            false,
            ["deriveBits"]
          );
        } else {
          privateKey = pair.privateKey;
        }
        const keys = [
          await webcrypto.get().subtle.importKey(
            "jwk",
            unmarshalPublicKey(curve, theirPub),
            {
              name: "ECDH",
              namedCurve: curve
            },
            false,
            []
          ),
          privateKey
        ];
        const buffer2 = await webcrypto.get().subtle.deriveBits(
          {
            name: "ECDH",
            namedCurve: curve,
            public: keys[0]
          },
          keys[1],
          bits[curve]
        );
        return new Uint8Array(buffer2, buffer2.byteOffset, buffer2.byteLength);
      };
      const publicKey = await webcrypto.get().subtle.exportKey("jwk", pair.publicKey);
      return {
        key: marshalPublicKey(publicKey),
        genSharedKey
      };
    };
    var curveLengths = {
      "P-256": 32,
      "P-384": 48,
      "P-521": 66
    };
    function marshalPublicKey(jwk) {
      const byteLen = curveLengths[jwk.crv];
      return uint8ArrayConcat([
        Uint8Array.from([4]),
        // uncompressed point
        base64urlToBuffer(jwk.x, byteLen),
        base64urlToBuffer(jwk.y, byteLen)
      ], 1 + byteLen * 2);
    }
    function unmarshalPublicKey(curve, key) {
      const byteLen = curveLengths[curve];
      if (uint8ArrayEquals(!key.slice(0, 1), Uint8Array.from([4]))) {
        throw errcode(new Error("Cannot unmarshal public key - invalid key format"), "ERR_INVALID_KEY_FORMAT");
      }
      return {
        kty: "EC",
        crv: curve,
        x: uint8ArrayToString(key.slice(1, byteLen + 1), "base64url"),
        y: uint8ArrayToString(key.slice(1 + byteLen), "base64url"),
        ext: true
      };
    }
    var unmarshalPrivateKey = (curve, key) => ({
      ...unmarshalPublicKey(curve, key.public),
      d: uint8ArrayToString(key.private, "base64url")
    });
  }
});

// node_modules/libp2p-crypto/src/keys/ephemeral-keys.js
var require_ephemeral_keys = __commonJS({
  "node_modules/libp2p-crypto/src/keys/ephemeral-keys.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var ecdh = require_ecdh_browser();
    module2.exports = async (curve) => ecdh.generateEphmeralKeyPair(curve);
  }
});

// node_modules/libp2p-crypto/src/keys/index.js
var require_keys2 = __commonJS({
  "node_modules/libp2p-crypto/src/keys/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var keysPBM = require_keys();
    require_asn1();
    require_pbe();
    var forge = require_forge();
    var errcode = require_err_code();
    var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
    var importer = require_importer();
    var supportedKeys = {
      rsa: require_rsa_class(),
      ed25519: require_ed25519_class(),
      secp256k1: require_secp256k1_class()(keysPBM, require_random_bytes())
    };
    var ErrMissingSecp256K1 = {
      message: "secp256k1 support requires libp2p-crypto-secp256k1 package",
      code: "ERR_MISSING_PACKAGE"
    };
    function typeToKey(type) {
      const key = supportedKeys[type.toLowerCase()];
      if (!key) {
        const supported = Object.keys(supportedKeys).join(" / ");
        throw errcode(new Error(`invalid or unsupported key type ${type}. Must be ${supported}`), "ERR_UNSUPPORTED_KEY_TYPE");
      }
      return key;
    }
    var generateKeyPair = async (type, bits) => {
      return typeToKey(type).generateKeyPair(bits);
    };
    var generateKeyPairFromSeed = async (type, seed, bits) => {
      const key = typeToKey(type);
      if (type.toLowerCase() !== "ed25519") {
        throw errcode(new Error("Seed key derivation is unimplemented for RSA or secp256k1"), "ERR_UNSUPPORTED_KEY_DERIVATION_TYPE");
      }
      return key.generateKeyPairFromSeed(seed, bits);
    };
    var unmarshalPublicKey = (buf2) => {
      const decoded = keysPBM.PublicKey.decode(buf2);
      const data = decoded.Data;
      switch (decoded.Type) {
        case keysPBM.KeyType.RSA:
          return supportedKeys.rsa.unmarshalRsaPublicKey(data);
        case keysPBM.KeyType.Ed25519:
          return supportedKeys.ed25519.unmarshalEd25519PublicKey(data);
        case keysPBM.KeyType.Secp256k1:
          if (supportedKeys.secp256k1) {
            return supportedKeys.secp256k1.unmarshalSecp256k1PublicKey(data);
          } else {
            throw errcode(new Error(ErrMissingSecp256K1.message), ErrMissingSecp256K1.code);
          }
        default:
          typeToKey(decoded.Type);
      }
    };
    var marshalPublicKey = (key, type) => {
      type = (type || "rsa").toLowerCase();
      typeToKey(type);
      return key.bytes;
    };
    var unmarshalPrivateKey = async (buf2) => {
      const decoded = keysPBM.PrivateKey.decode(buf2);
      const data = decoded.Data;
      switch (decoded.Type) {
        case keysPBM.KeyType.RSA:
          return supportedKeys.rsa.unmarshalRsaPrivateKey(data);
        case keysPBM.KeyType.Ed25519:
          return supportedKeys.ed25519.unmarshalEd25519PrivateKey(data);
        case keysPBM.KeyType.Secp256k1:
          if (supportedKeys.secp256k1) {
            return supportedKeys.secp256k1.unmarshalSecp256k1PrivateKey(data);
          } else {
            throw errcode(new Error(ErrMissingSecp256K1.message), ErrMissingSecp256K1.code);
          }
        default:
          typeToKey(decoded.Type);
      }
    };
    var marshalPrivateKey = (key, type) => {
      type = (type || "rsa").toLowerCase();
      typeToKey(type);
      return key.bytes;
    };
    var importKey = async (encryptedKey, password) => {
      try {
        const key2 = await importer.import(encryptedKey, password);
        return unmarshalPrivateKey(key2);
      } catch (_2) {
      }
      const key = forge.pki.decryptRsaPrivateKey(encryptedKey, password);
      if (key === null) {
        throw errcode(new Error("Cannot read the key, most likely the password is wrong or not a RSA key"), "ERR_CANNOT_DECRYPT_PEM");
      }
      let der = forge.asn1.toDer(forge.pki.privateKeyToAsn1(key));
      der = uint8ArrayFromString(der.getBytes(), "ascii");
      return supportedKeys.rsa.unmarshalRsaPrivateKey(der);
    };
    module2.exports = {
      supportedKeys,
      keysPBM,
      keyStretcher: require_key_stretcher(),
      generateEphemeralKeyPair: require_ephemeral_keys(),
      generateKeyPair,
      generateKeyPairFromSeed,
      unmarshalPublicKey,
      marshalPublicKey,
      unmarshalPrivateKey,
      marshalPrivateKey,
      import: importKey
    };
  }
});

// node_modules/libp2p-crypto/src/pbkdf2.js
var require_pbkdf22 = __commonJS({
  "node_modules/libp2p-crypto/src/pbkdf2.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var forgePbkdf2 = require_pbkdf2();
    var forgeUtil = require_util();
    var errcode = require_err_code();
    var hashName = {
      sha1: "sha1",
      "sha2-256": "sha256",
      "sha2-512": "sha512"
    };
    function pbkdf2(password, salt, iterations, keySize, hash) {
      const hasher = hashName[hash];
      if (!hasher) {
        const types = Object.keys(hashName).join(" / ");
        throw errcode(new Error(`Hash '${hash}' is unknown or not supported. Must be ${types}`), "ERR_UNSUPPORTED_HASH_TYPE");
      }
      const dek = forgePbkdf2(
        password,
        salt,
        iterations,
        keySize,
        hasher
      );
      return forgeUtil.encode64(dek);
    }
    module2.exports = pbkdf2;
  }
});

// node_modules/libp2p-crypto/src/index.js
var require_src = __commonJS({
  "node_modules/libp2p-crypto/src/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var hmac = require_index_browser();
    var aes = require_aes2();
    var keys = require_keys2();
    exports2.aes = aes;
    exports2.hmac = hmac;
    exports2.keys = keys;
    exports2.randomBytes = require_random_bytes();
    exports2.pbkdf2 = require_pbkdf22();
  }
});

// node_modules/timestamp-nano/dist/timestamp.min.js
var require_timestamp_min = __commonJS({
  "node_modules/timestamp-nano/dist/timestamp.min.js"(exports2, module2) {
    init_esbuild_shims();
    var Timestamp = function() {
      "undefined" != typeof module2 && (module2.exports = d2);
      var l2 = 86400, s = 3200, T = 146097 * s / 400, e2 = l2 * T, f2 = 1e3 * e2, c = 864e13, g2 = 4294967296, h2 = 1e6, u = "000000000", m = Math.trunc || function(n3) {
        var t3 = n3 - n3 % 1;
        return 0 == t3 && (n3 < 0 || 0 === n3 && 1 / n3 != 1 / 0) ? -0 : t3;
      }, n2 = d2.prototype, o = (d2.fromDate = function(n3) {
        return new d2(+n3);
      }, d2.fromInt64BE = r(0, 1, 2, 3, 0, 4), d2.fromInt64LE = r(3, 2, 1, 0, 4, 0), d2.fromString = function(n3) {
        var e3, r2 = new d2(), n3 = (n3 += "").replace(/^\s*[+\-]?\d+/, function(n4) {
          var n4 = +n4, t3 = 1970 + (n4 - 1970) % 400;
          return r2.year = n4 - t3, t3;
        }).replace(/(?:Z|([+\-]\d{2}):?(\d{2}))$/, function(n4, t3, r3) {
          return t3 < 0 && (r3 *= -1), e3 = 6e4 * (60 * +t3 + +r3), "";
        }).replace(/\.\d+$/, function(n4) {
          return r2.nano = +(n4 + u).substr(1, 9), "";
        }).split(/\D+/);
        1 < n3.length ? n3[1]-- : n3[1] = 0;
        if (r2.time = e3 = Date.UTC.apply(Date, n3) - (e3 || 0), isNaN(e3)) throw new TypeError("Invalid Date");
        return p2(r2);
      }, d2.fromTimeT = function(n3) {
        return y2(n3, 0);
      }, n2.year = 0, n2.time = 0, n2.nano = 0, n2.addNano = function(n3) {
        return this.nano += +n3 || 0, this;
      }, n2.getNano = function() {
        var n3 = p2(this);
        return (n3.time % 1e3 * h2 + +n3.nano + 1e9) % 1e9;
      }, n2.getTimeT = function() {
        var n3 = p2(this), t3 = Math.floor(n3.time / 1e3), n3 = n3.year;
        n3 && (t3 += n3 * T * l2 / s);
        return t3;
      }, n2.getYear = function() {
        return this.toDate().getUTCFullYear() + this.year;
      }, n2.toDate = function() {
        return M(p2(this).time);
      }, n2.toJSON = function() {
        return this.toString().replace(/0{1,6}Z$/, "Z");
      }, n2.toString = function(n3) {
        var t3 = this, r2 = t3.toDate(), u2 = { H: function() {
          return C(r2.getUTCHours());
        }, L: function() {
          return D(r2.getUTCMilliseconds(), 3);
        }, M: function() {
          return C(r2.getUTCMinutes());
        }, N: function() {
          return D(t3.getNano(), 9);
        }, S: function() {
          return C(r2.getUTCSeconds());
        }, Y: function() {
          var n4 = t3.getYear();
          return 999999 < n4 ? "+" + n4 : 9999 < n4 ? "+" + D(n4, 6) : 0 <= n4 ? D(n4, 4) : -999999 <= n4 ? "-" + D(-n4, 6) : n4;
        }, a: function() {
          return a[r2.getUTCDay()];
        }, b: function() {
          return i[r2.getUTCMonth()];
        }, d: function() {
          return C(r2.getUTCDate());
        }, e: function() {
          return function(n4) {
            return (9 < n4 ? "" : " ") + (0 | n4);
          }(r2.getUTCDate());
        }, m: function() {
          return C(r2.getUTCMonth() + 1);
        } };
        return function e3(n4) {
          return n4.replace(/%./g, function(n5) {
            var t4 = n5[1], r3 = v2[t4], t4 = u2[t4];
            return r3 ? e3(r3) : t4 ? t4() : n5;
          });
        }(n3 || o);
      }, n2.writeInt64BE = t2(0, 1, 2, 3, 0, 4), n2.writeInt64LE = t2(3, 2, 1, 0, 4, 0), "%Y-%m-%dT%H:%M:%S.%NZ"), i = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], a = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], v2 = { "%": "%", F: "%Y-%m-%d", n: "\n", R: "%H:%M", T: "%H:%M:%S", t: "	", X: "%T", Z: "GMT", z: "+0000" };
      return d2;
      function d2(n3, t3, r2) {
        var e3 = this;
        if (!(e3 instanceof d2)) return new d2(n3, t3, r2);
        e3.time = +n3 || 0, e3.nano = +t3 || 0, e3.year = +r2 || 0, p2(e3);
      }
      function p2(n3) {
        var t3, r2, e3, u2 = n3.year, o2 = n3.time, i2 = n3.nano, a2 = ((i2 < 0 || h2 <= i2) && (i2 -= (r2 = Math.floor(i2 / h2)) * h2, o2 += r2, r2 = 1), u2 % s);
        return (o2 < -c || c < o2 || a2) && ((t3 = m(o2 / f2)) && (u2 += t3 * s, o2 -= t3 * f2), (e3 = M(o2)).setUTCFullYear(a2 + e3.getUTCFullYear()), e3 = (o2 = +e3) + (t3 = m((u2 -= a2) / s)) * f2, t3 && -c <= e3 && e3 <= c && (u2 -= t3 * s, o2 = e3), r2 = 1), r2 && (n3.year = u2, n3.time = o2, n3.nano = i2), n3;
      }
      function M(n3) {
        var t3 = /* @__PURE__ */ new Date(0);
        return t3.setTime(n3), t3;
      }
      function y2(n3, t3) {
        n3 = +n3 || 0;
        var r2 = m((t3 = (t3 | 0) * g2) / e2) + m(n3 / e2), t3 = t3 % e2 + n3 % e2, n3 = m(t3 / e2);
        return n3 && (r2 += n3, t3 -= n3 * e2), new d2(1e3 * t3, 0, r2 * s);
      }
      function t2(e3, u2, o2, i2, a2, f3) {
        return function(n3, t3) {
          var r2 = p2(this);
          n3 = n3 || new Array(8);
          w2(n3, t3 |= 0);
          var e4 = Math.floor(r2.time / 1e3), r2 = r2.year * (T * l2 / s), u3 = m(r2 / g2) + m(e4 / g2), r2 = r2 % g2 + e4 % g2, e4 = Math.floor(r2 / g2);
          e4 && (u3 += e4, r2 -= e4 * g2);
          return c2(n3, t3 + a2, u3), c2(n3, t3 + f3, r2), n3;
        };
        function c2(n3, t3, r2) {
          n3[t3 + e3] = r2 >> 24 & 255, n3[t3 + u2] = r2 >> 16 & 255, n3[t3 + o2] = r2 >> 8 & 255, n3[t3 + i2] = 255 & r2;
        }
      }
      function r(r2, e3, u2, o2, i2, a2) {
        return function(n3, t3) {
          w2(n3, t3 |= 0);
          var r3 = f3(n3, t3 + i2);
          return y2(f3(n3, t3 + a2), r3);
        };
        function f3(n3, t3) {
          return 16777216 * n3[t3 + r2] + (n3[t3 + e3] << 16 | n3[t3 + u2] << 8 | n3[t3 + o2]);
        }
      }
      function w2(n3, t3) {
        n3 = n3 && n3.length;
        if (null == n3) throw new TypeError("Invalid Buffer");
        if (n3 < t3 + 8) throw new RangeError("Out of range");
      }
      function C(n3) {
        return (9 < n3 ? "" : "0") + (0 | n3);
      }
      function D(n3, t3) {
        return (u + (0 | n3)).substr(-t3);
      }
    }();
  }
});

// node_modules/interface-datastore/esm/src/key.js
var pathSepS, pathSepB, pathSep;
var init_key = __esm({
  "node_modules/interface-datastore/esm/src/key.js"() {
    init_esbuild_shims();
    init_to_string();
    init_from_string();
    pathSepS = "/";
    pathSepB = new TextEncoder().encode(pathSepS);
    pathSep = pathSepB[0];
  }
});

// node_modules/class-is/index.js
var require_class_is = __commonJS({
  "node_modules/class-is/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    function withIs(Class, { className, symbolName }) {
      const symbol = Symbol.for(symbolName);
      const ClassIsWrapper = {
        // The code below assigns the class wrapper to an object to trick
        // JavaScript engines to show the name of the extended class when
        // logging an instances.
        // We are assigning an anonymous class (class wrapper) to the object
        // with key `className` to keep the correct name.
        // If this is not supported it falls back to logging `ClassIsWrapper`.
        [className]: class extends Class {
          constructor(...args) {
            super(...args);
            Object.defineProperty(this, symbol, { value: true });
          }
          get [Symbol.toStringTag]() {
            return className;
          }
        }
      }[className];
      ClassIsWrapper[`is${className}`] = (obj) => !!(obj && obj[symbol]);
      return ClassIsWrapper;
    }
    function withIsProto(Class, { className, symbolName, withoutNew }) {
      const symbol = Symbol.for(symbolName);
      const ClassIsWrapper = {
        [className]: function(...args) {
          if (withoutNew && !(this instanceof ClassIsWrapper)) {
            return new ClassIsWrapper(...args);
          }
          const _this = Class.call(this, ...args) || this;
          if (_this && !_this[symbol]) {
            Object.defineProperty(_this, symbol, { value: true });
          }
          return _this;
        }
      }[className];
      ClassIsWrapper.prototype = Object.create(Class.prototype);
      ClassIsWrapper.prototype.constructor = ClassIsWrapper;
      Object.defineProperty(ClassIsWrapper.prototype, Symbol.toStringTag, {
        get() {
          return className;
        }
      });
      ClassIsWrapper[`is${className}`] = (obj) => !!(obj && obj[symbol]);
      return ClassIsWrapper;
    }
    module2.exports = withIs;
    module2.exports.proto = withIsProto;
  }
});

// node_modules/peer-id/src/proto.js
var require_proto = __commonJS({
  "node_modules/peer-id/src/proto.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var $protobuf2 = require_minimal2();
    var $Reader2 = $protobuf2.Reader;
    var $Writer2 = $protobuf2.Writer;
    var $util2 = $protobuf2.util;
    var $root2 = $protobuf2.roots["libp2p-peer-id"] || ($protobuf2.roots["libp2p-peer-id"] = {});
    $root2.PeerIdProto = function() {
      function PeerIdProto(p2) {
        if (p2) {
          for (var ks = Object.keys(p2), i = 0; i < ks.length; ++i)
            if (p2[ks[i]] != null)
              this[ks[i]] = p2[ks[i]];
        }
      }
      PeerIdProto.prototype.id = $util2.newBuffer([]);
      PeerIdProto.prototype.pubKey = $util2.newBuffer([]);
      PeerIdProto.prototype.privKey = $util2.newBuffer([]);
      PeerIdProto.encode = function encode6(m, w2) {
        if (!w2)
          w2 = $Writer2.create();
        w2.uint32(10).bytes(m.id);
        if (m.pubKey != null && Object.hasOwnProperty.call(m, "pubKey"))
          w2.uint32(18).bytes(m.pubKey);
        if (m.privKey != null && Object.hasOwnProperty.call(m, "privKey"))
          w2.uint32(26).bytes(m.privKey);
        return w2;
      };
      PeerIdProto.decode = function decode7(r, l2) {
        if (!(r instanceof $Reader2))
          r = $Reader2.create(r);
        var c = l2 === void 0 ? r.len : r.pos + l2, m = new $root2.PeerIdProto();
        while (r.pos < c) {
          var t2 = r.uint32();
          switch (t2 >>> 3) {
            case 1:
              m.id = r.bytes();
              break;
            case 2:
              m.pubKey = r.bytes();
              break;
            case 3:
              m.privKey = r.bytes();
              break;
            default:
              r.skipType(t2 & 7);
              break;
          }
        }
        if (!m.hasOwnProperty("id"))
          throw $util2.ProtocolError("missing required 'id'", { instance: m });
        return m;
      };
      PeerIdProto.fromObject = function fromObject(d2) {
        if (d2 instanceof $root2.PeerIdProto)
          return d2;
        var m = new $root2.PeerIdProto();
        if (d2.id != null) {
          if (typeof d2.id === "string")
            $util2.base64.decode(d2.id, m.id = $util2.newBuffer($util2.base64.length(d2.id)), 0);
          else if (d2.id.length)
            m.id = d2.id;
        }
        if (d2.pubKey != null) {
          if (typeof d2.pubKey === "string")
            $util2.base64.decode(d2.pubKey, m.pubKey = $util2.newBuffer($util2.base64.length(d2.pubKey)), 0);
          else if (d2.pubKey.length)
            m.pubKey = d2.pubKey;
        }
        if (d2.privKey != null) {
          if (typeof d2.privKey === "string")
            $util2.base64.decode(d2.privKey, m.privKey = $util2.newBuffer($util2.base64.length(d2.privKey)), 0);
          else if (d2.privKey.length)
            m.privKey = d2.privKey;
        }
        return m;
      };
      PeerIdProto.toObject = function toObject(m, o) {
        if (!o)
          o = {};
        var d2 = {};
        if (o.defaults) {
          if (o.bytes === String)
            d2.id = "";
          else {
            d2.id = [];
            if (o.bytes !== Array)
              d2.id = $util2.newBuffer(d2.id);
          }
          if (o.bytes === String)
            d2.pubKey = "";
          else {
            d2.pubKey = [];
            if (o.bytes !== Array)
              d2.pubKey = $util2.newBuffer(d2.pubKey);
          }
          if (o.bytes === String)
            d2.privKey = "";
          else {
            d2.privKey = [];
            if (o.bytes !== Array)
              d2.privKey = $util2.newBuffer(d2.privKey);
          }
        }
        if (m.id != null && m.hasOwnProperty("id")) {
          d2.id = o.bytes === String ? $util2.base64.encode(m.id, 0, m.id.length) : o.bytes === Array ? Array.prototype.slice.call(m.id) : m.id;
        }
        if (m.pubKey != null && m.hasOwnProperty("pubKey")) {
          d2.pubKey = o.bytes === String ? $util2.base64.encode(m.pubKey, 0, m.pubKey.length) : o.bytes === Array ? Array.prototype.slice.call(m.pubKey) : m.pubKey;
        }
        if (m.privKey != null && m.hasOwnProperty("privKey")) {
          d2.privKey = o.bytes === String ? $util2.base64.encode(m.privKey, 0, m.privKey.length) : o.bytes === Array ? Array.prototype.slice.call(m.privKey) : m.privKey;
        }
        return d2;
      };
      PeerIdProto.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf2.util.toJSONOptions);
      };
      return PeerIdProto;
    }();
    module2.exports = $root2;
  }
});

// node_modules/peer-id/src/index.js
var require_src2 = __commonJS({
  "node_modules/peer-id/src/index.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    var { CID: CID2 } = (init_cid(), __toCommonJS(cid_exports));
    var b32 = (init_base32(), __toCommonJS(base32_exports));
    var b36 = (init_base36(), __toCommonJS(base36_exports));
    var b58 = (init_base58(), __toCommonJS(base58_exports));
    var b64 = (init_base64(), __toCommonJS(base64_exports));
    var { base58btc: base58btc2 } = (init_base58(), __toCommonJS(base58_exports));
    var { base32: base322 } = (init_base32(), __toCommonJS(base32_exports));
    var { base16: base162 } = (init_base16(), __toCommonJS(base16_exports));
    var Digest2 = (init_digest(), __toCommonJS(digest_exports));
    var cryptoKeys = require_keys2();
    var withIs = require_class_is();
    var { PeerIdProto } = require_proto();
    var { equals: uint8ArrayEquals } = (init_equals(), __toCommonJS(equals_exports));
    var { fromString: uint8ArrayFromString } = (init_from_string(), __toCommonJS(from_string_exports));
    var { toString: uint8ArrayToString } = (init_to_string(), __toCommonJS(to_string_exports));
    var { identity: identity3 } = (init_identity2(), __toCommonJS(identity_exports2));
    var bases2 = {
      ...b32,
      ...b36,
      ...b58,
      ...b64
    };
    var baseDecoder = Object.keys(bases2).reduce(
      (acc, curr) => acc.or(bases2[curr]),
      base322.decoder
    );
    var DAG_PB_CODE2 = 112;
    var LIBP2P_KEY_CODE = 114;
    var PeerId2 = class {
      constructor(id, privKey, pubKey) {
        if (!(id instanceof Uint8Array)) {
          throw new Error("invalid id provided");
        }
        if (privKey && pubKey && !uint8ArrayEquals(privKey.public.bytes, pubKey.bytes)) {
          throw new Error("inconsistent arguments");
        }
        this._id = id;
        this._idB58String = base58btc2.encode(this.id).substring(1);
        this._privKey = privKey;
        this._pubKey = pubKey;
      }
      get id() {
        return this._id;
      }
      set id(val) {
        throw new Error("Id is immutable");
      }
      get privKey() {
        return this._privKey;
      }
      set privKey(privKey) {
        this._privKey = privKey;
      }
      get pubKey() {
        if (this._pubKey) {
          return this._pubKey;
        }
        if (this._privKey) {
          return this._privKey.public;
        }
        try {
          const decoded = Digest2.decode(this.id);
          if (decoded.code === identity3.code) {
            this._pubKey = cryptoKeys.unmarshalPublicKey(decoded.digest);
          }
        } catch (_2) {
        }
        return this._pubKey;
      }
      set pubKey(pubKey) {
        this._pubKey = pubKey;
      }
      // Return the protobuf version of the public key, matching go ipfs formatting
      marshalPubKey() {
        if (this.pubKey) {
          return cryptoKeys.marshalPublicKey(this.pubKey);
        }
      }
      // Return the protobuf version of the private key, matching go ipfs formatting
      marshalPrivKey() {
        if (this.privKey) {
          return cryptoKeys.marshalPrivateKey(this.privKey);
        }
      }
      // Return the protobuf version of the peer-id
      marshal(excludePriv) {
        return PeerIdProto.encode({
          id: this.toBytes(),
          pubKey: this.marshalPubKey(),
          privKey: excludePriv ? null : this.marshalPrivKey()
        }).finish();
      }
      toPrint() {
        let pid = this.toB58String();
        if (pid.startsWith("Qm")) {
          pid = pid.slice(2);
        }
        let maxRunes = 6;
        if (pid.length < maxRunes) {
          maxRunes = pid.length;
        }
        return "<peer.ID " + pid.substr(0, maxRunes) + ">";
      }
      // return the jsonified version of the key, matching the formatting
      // of go-ipfs for its config file
      toJSON() {
        return {
          id: this.toB58String(),
          privKey: toB64Opt(this.marshalPrivKey()),
          pubKey: toB64Opt(this.marshalPubKey())
        };
      }
      // encode/decode functions
      toHexString() {
        return base162.encode(this.id).substring(1);
      }
      toBytes() {
        return this.id;
      }
      toB58String() {
        return this._idB58String;
      }
      // return self-describing String representation
      // in default format from RFC 0001: https://github.com/libp2p/specs/pull/209
      toString() {
        if (!this._idCIDString) {
          const cid = CID2.createV1(LIBP2P_KEY_CODE, Digest2.decode(this.id));
          Object.defineProperty(this, "_idCIDString", {
            value: cid.toString(),
            enumerable: false
          });
        }
        return this._idCIDString;
      }
      /**
       * Checks the equality of `this` peer against a given PeerId.
       *
       * @param {Uint8Array|PeerId} id
       * @returns {boolean}
       */
      equals(id) {
        if (id instanceof Uint8Array) {
          return uint8ArrayEquals(this.id, id);
        } else if (id.id) {
          return uint8ArrayEquals(this.id, id.id);
        } else {
          throw new Error("not valid Id");
        }
      }
      /**
       * Checks the equality of `this` peer against a given PeerId.
       *
       * @deprecated Use `.equals`
       * @param {Uint8Array|PeerId} id
       * @returns {boolean}
       */
      isEqual(id) {
        return this.equals(id);
      }
      /*
       * Check if this PeerId instance is valid (privKey -> pubKey -> Id)
       */
      isValid() {
        return Boolean(this.privKey && this.privKey.public && this.privKey.public.bytes && this.pubKey.bytes instanceof Uint8Array && uint8ArrayEquals(this.privKey.public.bytes, this.pubKey.bytes));
      }
      /**
       * Check if the PeerId has an inline public key.
       *
       * @returns {boolean}
       */
      hasInlinePublicKey() {
        try {
          const decoded = Digest2.decode(this.id);
          if (decoded.code === identity3.code) {
            return true;
          }
        } catch (_2) {
        }
        return false;
      }
    };
    var PeerIdWithIs = withIs(PeerId2, {
      className: "PeerId",
      symbolName: "@libp2p/js-peer-id/PeerId"
    });
    exports2 = module2.exports = PeerIdWithIs;
    var computeDigest = (pubKey) => {
      if (pubKey.bytes.length <= 42) {
        return Digest2.create(identity3.code, pubKey.bytes).bytes;
      } else {
        return pubKey.hash();
      }
    };
    var computePeerId = async (privKey, pubKey) => {
      const digest2 = await computeDigest(pubKey);
      return new PeerIdWithIs(digest2, privKey, pubKey);
    };
    exports2.create = async (opts) => {
      opts = opts || {};
      opts.bits = opts.bits || 2048;
      opts.keyType = opts.keyType || "RSA";
      const key = await cryptoKeys.generateKeyPair(opts.keyType, opts.bits);
      return computePeerId(key, key.public);
    };
    exports2.createFromHexString = (str) => {
      return new PeerIdWithIs(base162.decode("f" + str));
    };
    exports2.createFromBytes = (buf2) => {
      try {
        const cid = CID2.decode(buf2);
        if (!validMulticodec(cid)) {
          throw new Error("Supplied PeerID CID is invalid");
        }
        return exports2.createFromCID(cid);
      } catch {
        const digest2 = Digest2.decode(buf2);
        if (digest2.code !== identity3.code) {
          throw new Error("Supplied PeerID CID is invalid");
        }
        return new PeerIdWithIs(buf2);
      }
    };
    exports2.createFromB58String = (str) => {
      return exports2.createFromBytes(base58btc2.decode("z" + str));
    };
    var validMulticodec = (cid) => {
      return cid.code === LIBP2P_KEY_CODE || cid.code === DAG_PB_CODE2;
    };
    exports2.createFromCID = (cid) => {
      cid = CID2.asCID(cid);
      if (!cid || !validMulticodec(cid)) {
        throw new Error("Supplied PeerID CID is invalid");
      }
      return new PeerIdWithIs(cid.multihash.bytes);
    };
    exports2.createFromPubKey = async (key) => {
      let buf2 = key;
      if (typeof buf2 === "string") {
        buf2 = uint8ArrayFromString(key, "base64pad");
      }
      if (!(buf2 instanceof Uint8Array)) {
        throw new Error("Supplied key is neither a base64 string nor a Uint8Array");
      }
      const pubKey = await cryptoKeys.unmarshalPublicKey(buf2);
      return computePeerId(void 0, pubKey);
    };
    exports2.createFromPrivKey = async (key) => {
      if (typeof key === "string") {
        key = uint8ArrayFromString(key, "base64pad");
      }
      if (!(key instanceof Uint8Array)) {
        throw new Error("Supplied key is neither a base64 string nor a Uint8Array");
      }
      const privKey = await cryptoKeys.unmarshalPrivateKey(key);
      return computePeerId(privKey, privKey.public);
    };
    exports2.createFromJSON = async (obj) => {
      const id = base58btc2.decode("z" + obj.id);
      const rawPrivKey = obj.privKey && uint8ArrayFromString(obj.privKey, "base64pad");
      const rawPubKey = obj.pubKey && uint8ArrayFromString(obj.pubKey, "base64pad");
      const pub = rawPubKey && await cryptoKeys.unmarshalPublicKey(rawPubKey);
      if (!rawPrivKey) {
        return new PeerIdWithIs(id, void 0, pub);
      }
      const privKey = await cryptoKeys.unmarshalPrivateKey(rawPrivKey);
      const privDigest = await computeDigest(privKey.public);
      let pubDigest;
      if (pub) {
        pubDigest = await computeDigest(pub);
      }
      if (pub && !uint8ArrayEquals(privDigest, pubDigest)) {
        throw new Error("Public and private key do not match");
      }
      if (id && !uint8ArrayEquals(privDigest, id)) {
        throw new Error("Id and private key do not match");
      }
      return new PeerIdWithIs(id, privKey, pub);
    };
    exports2.createFromProtobuf = async (buf2) => {
      if (typeof buf2 === "string") {
        buf2 = uint8ArrayFromString(buf2, "base16");
      }
      let { id, privKey, pubKey } = PeerIdProto.decode(buf2);
      privKey = privKey ? await cryptoKeys.unmarshalPrivateKey(privKey) : false;
      pubKey = pubKey ? await cryptoKeys.unmarshalPublicKey(pubKey) : false;
      let pubDigest;
      let privDigest;
      if (privKey) {
        privDigest = await computeDigest(privKey.public);
      }
      if (pubKey) {
        pubDigest = await computeDigest(pubKey);
      }
      if (privKey) {
        if (pubKey) {
          if (!uint8ArrayEquals(privDigest, pubDigest)) {
            throw new Error("Public and private key do not match");
          }
        }
        return new PeerIdWithIs(privDigest, privKey, privKey.public);
      }
      if (pubKey) {
        return new PeerIdWithIs(pubDigest, void 0, pubKey);
      }
      if (id) {
        return new PeerIdWithIs(id);
      }
      throw new Error("Protobuf did not contain any usable key material");
    };
    exports2.parse = (str) => {
      if (str.charAt(0) === "1" || str.charAt(0) === "Q") {
        str = `z${str}`;
      }
      return exports2.createFromBytes(baseDecoder.decode(str));
    };
    exports2.isPeerId = (peerId) => {
      return Boolean(typeof peerId === "object" && peerId._id && peerId._idB58String);
    };
    function toB64Opt(val) {
      if (val) {
        return uint8ArrayToString(val, "base64pad");
      }
    }
  }
});

// node_modules/cborg/esm/lib/is.js
function is(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (value === true || value === false) {
    return "boolean";
  }
  const typeOf = typeof value;
  if (typeofs.includes(typeOf)) {
    return typeOf;
  }
  if (typeOf === "function") {
    return "Function";
  }
  if (Array.isArray(value)) {
    return "Array";
  }
  if (isBuffer(value)) {
    return "Buffer";
  }
  const objectType = getObjectType(value);
  if (objectType) {
    return objectType;
  }
  return "Object";
}
function isBuffer(value) {
  return value && value.constructor && value.constructor.isBuffer && value.constructor.isBuffer.call(null, value);
}
function getObjectType(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (objectTypeNames.includes(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}
var typeofs, objectTypeNames;
var init_is = __esm({
  "node_modules/cborg/esm/lib/is.js"() {
    init_esbuild_shims();
    typeofs = [
      "string",
      "number",
      "bigint",
      "symbol"
    ];
    objectTypeNames = [
      "Function",
      "Generator",
      "AsyncGenerator",
      "GeneratorFunction",
      "AsyncGeneratorFunction",
      "AsyncFunction",
      "Observable",
      "Array",
      "Buffer",
      "Object",
      "RegExp",
      "Date",
      "Error",
      "Map",
      "Set",
      "WeakMap",
      "WeakSet",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "DataView",
      "Promise",
      "URL",
      "HTMLElement",
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Uint16Array",
      "Int32Array",
      "Uint32Array",
      "Float32Array",
      "Float64Array",
      "BigInt64Array",
      "BigUint64Array"
    ];
  }
});

// node_modules/cborg/esm/lib/token.js
var Type, Token;
var init_token = __esm({
  "node_modules/cborg/esm/lib/token.js"() {
    init_esbuild_shims();
    Type = class {
      constructor(major, name2, terminal) {
        this.major = major;
        this.majorEncoded = major << 5;
        this.name = name2;
        this.terminal = terminal;
      }
      toString() {
        return `Type[${this.major}].${this.name}`;
      }
      compare(typ) {
        return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
      }
    };
    Type.uint = new Type(0, "uint", true);
    Type.negint = new Type(1, "negint", true);
    Type.bytes = new Type(2, "bytes", true);
    Type.string = new Type(3, "string", true);
    Type.array = new Type(4, "array", false);
    Type.map = new Type(5, "map", false);
    Type.tag = new Type(6, "tag", false);
    Type.float = new Type(7, "float", true);
    Type.false = new Type(7, "false", true);
    Type.true = new Type(7, "true", true);
    Type.null = new Type(7, "null", true);
    Type.undefined = new Type(7, "undefined", true);
    Type.break = new Type(7, "break", true);
    Token = class {
      constructor(type, value, encodedLength) {
        this.type = type;
        this.value = value;
        this.encodedLength = encodedLength;
        this.encodedBytes = void 0;
        this.byteValue = void 0;
      }
      toString() {
        return `Token[${this.type}].${this.value}`;
      }
    };
  }
});

// node_modules/cborg/esm/lib/byte-utils.js
function isBuffer2(buf2) {
  return useBuffer && globalThis.Buffer.isBuffer(buf2);
}
function asU8A(buf2) {
  if (!(buf2 instanceof Uint8Array)) {
    return Uint8Array.from(buf2);
  }
  return isBuffer2(buf2) ? new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength) : buf2;
}
function compare(b1, b2) {
  if (isBuffer2(b1) && isBuffer2(b2)) {
    return b1.compare(b2);
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] === b2[i]) {
      continue;
    }
    return b1[i] < b2[i] ? -1 : 1;
  }
  return 0;
}
function utf8ToBytes(string2, units = Infinity) {
  let codePoint;
  const length2 = string2.length;
  let leadSurrogate = null;
  const bytes = [];
  for (let i = 0; i < length2; ++i) {
    codePoint = string2.charCodeAt(i);
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        } else if (i + 1 === length2) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
        leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1)
        bytes.push(239, 191, 189);
    }
    leadSurrogate = null;
    if (codePoint < 128) {
      if ((units -= 1) < 0)
        break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0)
        break;
      bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0)
        break;
      bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0)
        break;
      bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
    } else {
      throw new Error("Invalid code point");
    }
  }
  return bytes;
}
function utf8Slice(buf2, offset, end) {
  const res = [];
  while (offset < end) {
    const firstByte = buf2[offset];
    let codePoint = null;
    let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (offset + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf2[offset + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          fourthByte = buf2[offset + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    offset += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
function decodeCodePointsArray(codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  let res = "";
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}
var useBuffer, textDecoder2, textEncoder2, toString3, fromString3, fromArray, slice, concat2, alloc, MAX_ARGUMENTS_LENGTH;
var init_byte_utils = __esm({
  "node_modules/cborg/esm/lib/byte-utils.js"() {
    init_esbuild_shims();
    useBuffer = globalThis.process && !globalThis.process.browser && globalThis.Buffer && typeof globalThis.Buffer.isBuffer === "function";
    textDecoder2 = new TextDecoder();
    textEncoder2 = new TextEncoder();
    toString3 = useBuffer ? (bytes, start, end) => {
      return end - start > 64 ? globalThis.Buffer.from(bytes.subarray(start, end)).toString("utf8") : utf8Slice(bytes, start, end);
    } : (bytes, start, end) => {
      return end - start > 64 ? textDecoder2.decode(bytes.subarray(start, end)) : utf8Slice(bytes, start, end);
    };
    fromString3 = useBuffer ? (string2) => {
      return string2.length > 64 ? globalThis.Buffer.from(string2) : utf8ToBytes(string2);
    } : (string2) => {
      return string2.length > 64 ? textEncoder2.encode(string2) : utf8ToBytes(string2);
    };
    fromArray = (arr) => {
      return Uint8Array.from(arr);
    };
    slice = useBuffer ? (bytes, start, end) => {
      if (isBuffer2(bytes)) {
        return new Uint8Array(bytes.subarray(start, end));
      }
      return bytes.slice(start, end);
    } : (bytes, start, end) => {
      return bytes.slice(start, end);
    };
    concat2 = useBuffer ? (chunks, length2) => {
      chunks = chunks.map((c) => c instanceof Uint8Array ? c : globalThis.Buffer.from(c));
      return asU8A(globalThis.Buffer.concat(chunks, length2));
    } : (chunks, length2) => {
      const out = new Uint8Array(length2);
      let off = 0;
      for (let b2 of chunks) {
        if (off + b2.length > out.length) {
          b2 = b2.subarray(0, out.length - off);
        }
        out.set(b2, off);
        off += b2.length;
      }
      return out;
    };
    alloc = useBuffer ? (size) => {
      return globalThis.Buffer.allocUnsafe(size);
    } : (size) => {
      return new Uint8Array(size);
    };
    MAX_ARGUMENTS_LENGTH = 4096;
  }
});

// node_modules/cborg/esm/lib/bl.js
var defaultChunkSize, Bl;
var init_bl = __esm({
  "node_modules/cborg/esm/lib/bl.js"() {
    init_esbuild_shims();
    init_byte_utils();
    defaultChunkSize = 256;
    Bl = class {
      constructor(chunkSize = defaultChunkSize) {
        this.chunkSize = chunkSize;
        this.cursor = 0;
        this.maxCursor = -1;
        this.chunks = [];
        this._initReuseChunk = null;
      }
      reset() {
        this.cursor = 0;
        this.maxCursor = -1;
        if (this.chunks.length) {
          this.chunks = [];
        }
        if (this._initReuseChunk !== null) {
          this.chunks.push(this._initReuseChunk);
          this.maxCursor = this._initReuseChunk.length - 1;
        }
      }
      push(bytes) {
        let topChunk = this.chunks[this.chunks.length - 1];
        const newMax = this.cursor + bytes.length;
        if (newMax <= this.maxCursor + 1) {
          const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
          topChunk.set(bytes, chunkPos);
        } else {
          if (topChunk) {
            const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
            if (chunkPos < topChunk.length) {
              this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos);
              this.maxCursor = this.cursor - 1;
            }
          }
          if (bytes.length < 64 && bytes.length < this.chunkSize) {
            topChunk = alloc(this.chunkSize);
            this.chunks.push(topChunk);
            this.maxCursor += topChunk.length;
            if (this._initReuseChunk === null) {
              this._initReuseChunk = topChunk;
            }
            topChunk.set(bytes, 0);
          } else {
            this.chunks.push(bytes);
            this.maxCursor += bytes.length;
          }
        }
        this.cursor += bytes.length;
      }
      toBytes(reset = false) {
        let byts;
        if (this.chunks.length === 1) {
          const chunk = this.chunks[0];
          if (reset && this.cursor > chunk.length / 2) {
            byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
            this._initReuseChunk = null;
            this.chunks = [];
          } else {
            byts = slice(chunk, 0, this.cursor);
          }
        } else {
          byts = concat2(this.chunks, this.cursor);
        }
        if (reset) {
          this.reset();
        }
        return byts;
      }
    };
  }
});

// node_modules/cborg/esm/lib/common.js
function assertEnoughData(data, pos, need) {
  if (data.length - pos < need) {
    throw new Error(`${decodeErrPrefix} not enough data for type`);
  }
}
var decodeErrPrefix, encodeErrPrefix, uintMinorPrefixBytes;
var init_common = __esm({
  "node_modules/cborg/esm/lib/common.js"() {
    init_esbuild_shims();
    decodeErrPrefix = "CBOR decode error:";
    encodeErrPrefix = "CBOR encode error:";
    uintMinorPrefixBytes = [];
    uintMinorPrefixBytes[23] = 1;
    uintMinorPrefixBytes[24] = 2;
    uintMinorPrefixBytes[25] = 3;
    uintMinorPrefixBytes[26] = 5;
    uintMinorPrefixBytes[27] = 9;
  }
});

// node_modules/cborg/esm/lib/0uint.js
function readUint8(data, offset, options) {
  assertEnoughData(data, offset, 1);
  const value = data[offset];
  if (options.strict === true && value < uintBoundaries[0]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint16(data, offset, options) {
  assertEnoughData(data, offset, 2);
  const value = data[offset] << 8 | data[offset + 1];
  if (options.strict === true && value < uintBoundaries[1]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint32(data, offset, options) {
  assertEnoughData(data, offset, 4);
  const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  if (options.strict === true && value < uintBoundaries[2]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint64(data, offset, options) {
  assertEnoughData(data, offset, 8);
  const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
  const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
  if (options.strict === true && value < uintBoundaries[3]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  if (value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }
  if (options.allowBigInt === true) {
    return value;
  }
  throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
}
function decodeUint8(data, pos, _minor, options) {
  return new Token(Type.uint, readUint8(data, pos + 1, options), 2);
}
function decodeUint16(data, pos, _minor, options) {
  return new Token(Type.uint, readUint16(data, pos + 1, options), 3);
}
function decodeUint32(data, pos, _minor, options) {
  return new Token(Type.uint, readUint32(data, pos + 1, options), 5);
}
function decodeUint64(data, pos, _minor, options) {
  return new Token(Type.uint, readUint64(data, pos + 1, options), 9);
}
function encodeUint(buf2, token) {
  return encodeUintValue(buf2, 0, token.value);
}
function encodeUintValue(buf2, major, uint) {
  if (uint < uintBoundaries[0]) {
    const nuint = Number(uint);
    buf2.push([major | nuint]);
  } else if (uint < uintBoundaries[1]) {
    const nuint = Number(uint);
    buf2.push([
      major | 24,
      nuint
    ]);
  } else if (uint < uintBoundaries[2]) {
    const nuint = Number(uint);
    buf2.push([
      major | 25,
      nuint >>> 8,
      nuint & 255
    ]);
  } else if (uint < uintBoundaries[3]) {
    const nuint = Number(uint);
    buf2.push([
      major | 26,
      nuint >>> 24 & 255,
      nuint >>> 16 & 255,
      nuint >>> 8 & 255,
      nuint & 255
    ]);
  } else {
    const buint = BigInt(uint);
    if (buint < uintBoundaries[4]) {
      const set = [
        major | 27,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ];
      let lo = Number(buint & BigInt(4294967295));
      let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
      set[8] = lo & 255;
      lo = lo >> 8;
      set[7] = lo & 255;
      lo = lo >> 8;
      set[6] = lo & 255;
      lo = lo >> 8;
      set[5] = lo & 255;
      set[4] = hi & 255;
      hi = hi >> 8;
      set[3] = hi & 255;
      hi = hi >> 8;
      set[2] = hi & 255;
      hi = hi >> 8;
      set[1] = hi & 255;
      buf2.push(set);
    } else {
      throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`);
    }
  }
}
var uintBoundaries;
var init_uint = __esm({
  "node_modules/cborg/esm/lib/0uint.js"() {
    init_esbuild_shims();
    init_token();
    init_common();
    uintBoundaries = [
      24,
      256,
      65536,
      4294967296,
      BigInt("18446744073709551616")
    ];
    encodeUint.encodedSize = function encodedSize(token) {
      return encodeUintValue.encodedSize(token.value);
    };
    encodeUintValue.encodedSize = function encodedSize2(uint) {
      if (uint < uintBoundaries[0]) {
        return 1;
      }
      if (uint < uintBoundaries[1]) {
        return 2;
      }
      if (uint < uintBoundaries[2]) {
        return 3;
      }
      if (uint < uintBoundaries[3]) {
        return 5;
      }
      return 9;
    };
    encodeUint.compareTokens = function compareTokens(tok1, tok2) {
      return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : 0;
    };
  }
});

// node_modules/cborg/esm/lib/1negint.js
function decodeNegint8(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2);
}
function decodeNegint16(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3);
}
function decodeNegint32(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5);
}
function decodeNegint64(data, pos, _minor, options) {
  const int = readUint64(data, pos + 1, options);
  if (typeof int !== "bigint") {
    const value = -1 - int;
    if (value >= Number.MIN_SAFE_INTEGER) {
      return new Token(Type.negint, value, 9);
    }
  }
  if (options.allowBigInt !== true) {
    throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
  }
  return new Token(Type.negint, neg1b - BigInt(int), 9);
}
function encodeNegint(buf2, token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  encodeUintValue(buf2, token.type.majorEncoded, unsigned);
}
var neg1b, pos1b;
var init_negint = __esm({
  "node_modules/cborg/esm/lib/1negint.js"() {
    init_esbuild_shims();
    init_token();
    init_uint();
    init_common();
    neg1b = BigInt(-1);
    pos1b = BigInt(1);
    encodeNegint.encodedSize = function encodedSize3(token) {
      const negint = token.value;
      const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
      if (unsigned < uintBoundaries[0]) {
        return 1;
      }
      if (unsigned < uintBoundaries[1]) {
        return 2;
      }
      if (unsigned < uintBoundaries[2]) {
        return 3;
      }
      if (unsigned < uintBoundaries[3]) {
        return 5;
      }
      return 9;
    };
    encodeNegint.compareTokens = function compareTokens2(tok1, tok2) {
      return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : 0;
    };
  }
});

// node_modules/cborg/esm/lib/2bytes.js
function toToken(data, pos, prefix, length2) {
  assertEnoughData(data, pos, prefix + length2);
  const buf2 = slice(data, pos + prefix, pos + prefix + length2);
  return new Token(Type.bytes, buf2, prefix + length2);
}
function decodeBytesCompact(data, pos, minor, _options) {
  return toToken(data, pos, 1, minor);
}
function decodeBytes8(data, pos, _minor, options) {
  return toToken(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeBytes16(data, pos, _minor, options) {
  return toToken(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeBytes32(data, pos, _minor, options) {
  return toToken(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeBytes64(data, pos, _minor, options) {
  const l2 = readUint64(data, pos + 1, options);
  if (typeof l2 === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
  }
  return toToken(data, pos, 9, l2);
}
function tokenBytes(token) {
  if (token.encodedBytes === void 0) {
    token.encodedBytes = token.type === Type.string ? fromString3(token.value) : token.value;
  }
  return token.encodedBytes;
}
function encodeBytes(buf2, token) {
  const bytes = tokenBytes(token);
  encodeUintValue(buf2, token.type.majorEncoded, bytes.length);
  buf2.push(bytes);
}
function compareBytes(b1, b2) {
  return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare(b1, b2);
}
var init_bytes2 = __esm({
  "node_modules/cborg/esm/lib/2bytes.js"() {
    init_esbuild_shims();
    init_token();
    init_common();
    init_uint();
    init_byte_utils();
    encodeBytes.encodedSize = function encodedSize4(token) {
      const bytes = tokenBytes(token);
      return encodeUintValue.encodedSize(bytes.length) + bytes.length;
    };
    encodeBytes.compareTokens = function compareTokens3(tok1, tok2) {
      return compareBytes(tokenBytes(tok1), tokenBytes(tok2));
    };
  }
});

// node_modules/cborg/esm/lib/3string.js
function toToken2(data, pos, prefix, length2, options) {
  const totLength = prefix + length2;
  assertEnoughData(data, pos, totLength);
  const tok = new Token(Type.string, toString3(data, pos + prefix, pos + totLength), totLength);
  if (options.retainStringBytes === true) {
    tok.byteValue = slice(data, pos + prefix, pos + totLength);
  }
  return tok;
}
function decodeStringCompact(data, pos, minor, options) {
  return toToken2(data, pos, 1, minor, options);
}
function decodeString8(data, pos, _minor, options) {
  return toToken2(data, pos, 2, readUint8(data, pos + 1, options), options);
}
function decodeString16(data, pos, _minor, options) {
  return toToken2(data, pos, 3, readUint16(data, pos + 1, options), options);
}
function decodeString32(data, pos, _minor, options) {
  return toToken2(data, pos, 5, readUint32(data, pos + 1, options), options);
}
function decodeString64(data, pos, _minor, options) {
  const l2 = readUint64(data, pos + 1, options);
  if (typeof l2 === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
  }
  return toToken2(data, pos, 9, l2, options);
}
var encodeString;
var init_string = __esm({
  "node_modules/cborg/esm/lib/3string.js"() {
    init_esbuild_shims();
    init_token();
    init_common();
    init_uint();
    init_bytes2();
    init_byte_utils();
    encodeString = encodeBytes;
  }
});

// node_modules/cborg/esm/lib/4array.js
function toToken3(_data, _pos, prefix, length2) {
  return new Token(Type.array, length2, prefix);
}
function decodeArrayCompact(data, pos, minor, _options) {
  return toToken3(data, pos, 1, minor);
}
function decodeArray8(data, pos, _minor, options) {
  return toToken3(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeArray16(data, pos, _minor, options) {
  return toToken3(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeArray32(data, pos, _minor, options) {
  return toToken3(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeArray64(data, pos, _minor, options) {
  const l2 = readUint64(data, pos + 1, options);
  if (typeof l2 === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
  }
  return toToken3(data, pos, 9, l2);
}
function decodeArrayIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken3(data, pos, 1, Infinity);
}
function encodeArray(buf2, token) {
  encodeUintValue(buf2, Type.array.majorEncoded, token.value);
}
var init_array = __esm({
  "node_modules/cborg/esm/lib/4array.js"() {
    init_esbuild_shims();
    init_token();
    init_uint();
    init_common();
    encodeArray.compareTokens = encodeUint.compareTokens;
    encodeArray.encodedSize = function encodedSize5(token) {
      return encodeUintValue.encodedSize(token.value);
    };
  }
});

// node_modules/cborg/esm/lib/5map.js
function toToken4(_data, _pos, prefix, length2) {
  return new Token(Type.map, length2, prefix);
}
function decodeMapCompact(data, pos, minor, _options) {
  return toToken4(data, pos, 1, minor);
}
function decodeMap8(data, pos, _minor, options) {
  return toToken4(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeMap16(data, pos, _minor, options) {
  return toToken4(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeMap32(data, pos, _minor, options) {
  return toToken4(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeMap64(data, pos, _minor, options) {
  const l2 = readUint64(data, pos + 1, options);
  if (typeof l2 === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
  }
  return toToken4(data, pos, 9, l2);
}
function decodeMapIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken4(data, pos, 1, Infinity);
}
function encodeMap(buf2, token) {
  encodeUintValue(buf2, Type.map.majorEncoded, token.value);
}
var init_map = __esm({
  "node_modules/cborg/esm/lib/5map.js"() {
    init_esbuild_shims();
    init_token();
    init_uint();
    init_common();
    encodeMap.compareTokens = encodeUint.compareTokens;
    encodeMap.encodedSize = function encodedSize6(token) {
      return encodeUintValue.encodedSize(token.value);
    };
  }
});

// node_modules/cborg/esm/lib/6tag.js
function decodeTagCompact(_data, _pos, minor, _options) {
  return new Token(Type.tag, minor, 1);
}
function decodeTag8(data, pos, _minor, options) {
  return new Token(Type.tag, readUint8(data, pos + 1, options), 2);
}
function decodeTag16(data, pos, _minor, options) {
  return new Token(Type.tag, readUint16(data, pos + 1, options), 3);
}
function decodeTag32(data, pos, _minor, options) {
  return new Token(Type.tag, readUint32(data, pos + 1, options), 5);
}
function decodeTag64(data, pos, _minor, options) {
  return new Token(Type.tag, readUint64(data, pos + 1, options), 9);
}
function encodeTag(buf2, token) {
  encodeUintValue(buf2, Type.tag.majorEncoded, token.value);
}
var init_tag = __esm({
  "node_modules/cborg/esm/lib/6tag.js"() {
    init_esbuild_shims();
    init_token();
    init_uint();
    encodeTag.compareTokens = encodeUint.compareTokens;
    encodeTag.encodedSize = function encodedSize7(token) {
      return encodeUintValue.encodedSize(token.value);
    };
  }
});

// node_modules/cborg/esm/lib/7float.js
function decodeUndefined(_data, _pos, _minor, options) {
  if (options.allowUndefined === false) {
    throw new Error(`${decodeErrPrefix} undefined values are not supported`);
  } else if (options.coerceUndefinedToNull === true) {
    return new Token(Type.null, null, 1);
  }
  return new Token(Type.undefined, void 0, 1);
}
function decodeBreak(_data, _pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return new Token(Type.break, void 0, 1);
}
function createToken(value, bytes, options) {
  if (options) {
    if (options.allowNaN === false && Number.isNaN(value)) {
      throw new Error(`${decodeErrPrefix} NaN values are not supported`);
    }
    if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) {
      throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
    }
  }
  return new Token(Type.float, value, bytes);
}
function decodeFloat16(data, pos, _minor, options) {
  return createToken(readFloat16(data, pos + 1), 3, options);
}
function decodeFloat32(data, pos, _minor, options) {
  return createToken(readFloat32(data, pos + 1), 5, options);
}
function decodeFloat64(data, pos, _minor, options) {
  return createToken(readFloat64(data, pos + 1), 9, options);
}
function encodeFloat(buf2, token, options) {
  const float = token.value;
  if (float === false) {
    buf2.push([Type.float.majorEncoded | MINOR_FALSE]);
  } else if (float === true) {
    buf2.push([Type.float.majorEncoded | MINOR_TRUE]);
  } else if (float === null) {
    buf2.push([Type.float.majorEncoded | MINOR_NULL]);
  } else if (float === void 0) {
    buf2.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
  } else {
    let decoded;
    let success = false;
    if (!options || options.float64 !== true) {
      encodeFloat16(float);
      decoded = readFloat16(ui8a, 1);
      if (float === decoded || Number.isNaN(float)) {
        ui8a[0] = 249;
        buf2.push(ui8a.slice(0, 3));
        success = true;
      } else {
        encodeFloat32(float);
        decoded = readFloat32(ui8a, 1);
        if (float === decoded) {
          ui8a[0] = 250;
          buf2.push(ui8a.slice(0, 5));
          success = true;
        }
      }
    }
    if (!success) {
      encodeFloat64(float);
      decoded = readFloat64(ui8a, 1);
      ui8a[0] = 251;
      buf2.push(ui8a.slice(0, 9));
    }
  }
}
function encodeFloat16(inp) {
  if (inp === Infinity) {
    dataView.setUint16(0, 31744, false);
  } else if (inp === -Infinity) {
    dataView.setUint16(0, 64512, false);
  } else if (Number.isNaN(inp)) {
    dataView.setUint16(0, 32256, false);
  } else {
    dataView.setFloat32(0, inp);
    const valu32 = dataView.getUint32(0);
    const exponent = (valu32 & 2139095040) >> 23;
    const mantissa = valu32 & 8388607;
    if (exponent === 255) {
      dataView.setUint16(0, 31744, false);
    } else if (exponent === 0) {
      dataView.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
    } else {
      const logicalExponent = exponent - 127;
      if (logicalExponent < -24) {
        dataView.setUint16(0, 0);
      } else if (logicalExponent < -14) {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | 1 << 24 + logicalExponent, false);
      } else {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
      }
    }
  }
}
function readFloat16(ui8a2, pos) {
  if (ui8a2.length - pos < 2) {
    throw new Error(`${decodeErrPrefix} not enough data for float16`);
  }
  const half = (ui8a2[pos] << 8) + ui8a2[pos + 1];
  if (half === 31744) {
    return Infinity;
  }
  if (half === 64512) {
    return -Infinity;
  }
  if (half === 32256) {
    return NaN;
  }
  const exp = half >> 10 & 31;
  const mant = half & 1023;
  let val;
  if (exp === 0) {
    val = mant * 2 ** -24;
  } else if (exp !== 31) {
    val = (mant + 1024) * 2 ** (exp - 25);
  } else {
    val = mant === 0 ? Infinity : NaN;
  }
  return half & 32768 ? -val : val;
}
function encodeFloat32(inp) {
  dataView.setFloat32(0, inp, false);
}
function readFloat32(ui8a2, pos) {
  if (ui8a2.length - pos < 4) {
    throw new Error(`${decodeErrPrefix} not enough data for float32`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 4).getFloat32(0, false);
}
function encodeFloat64(inp) {
  dataView.setFloat64(0, inp, false);
}
function readFloat64(ui8a2, pos) {
  if (ui8a2.length - pos < 8) {
    throw new Error(`${decodeErrPrefix} not enough data for float64`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 8).getFloat64(0, false);
}
var MINOR_FALSE, MINOR_TRUE, MINOR_NULL, MINOR_UNDEFINED, buffer, dataView, ui8a;
var init_float = __esm({
  "node_modules/cborg/esm/lib/7float.js"() {
    init_esbuild_shims();
    init_token();
    init_common();
    init_uint();
    MINOR_FALSE = 20;
    MINOR_TRUE = 21;
    MINOR_NULL = 22;
    MINOR_UNDEFINED = 23;
    encodeFloat.encodedSize = function encodedSize8(token, options) {
      const float = token.value;
      if (float === false || float === true || float === null || float === void 0) {
        return 1;
      }
      if (!options || options.float64 !== true) {
        encodeFloat16(float);
        let decoded = readFloat16(ui8a, 1);
        if (float === decoded || Number.isNaN(float)) {
          return 3;
        }
        encodeFloat32(float);
        decoded = readFloat32(ui8a, 1);
        if (float === decoded) {
          return 5;
        }
      }
      return 9;
    };
    buffer = new ArrayBuffer(9);
    dataView = new DataView(buffer, 1);
    ui8a = new Uint8Array(buffer, 0);
    encodeFloat.compareTokens = encodeUint.compareTokens;
  }
});

// node_modules/cborg/esm/lib/jump.js
function invalidMinor(data, pos, minor) {
  throw new Error(`${decodeErrPrefix} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
}
function errorer(msg) {
  return () => {
    throw new Error(`${decodeErrPrefix} ${msg}`);
  };
}
function quickEncodeToken(token) {
  switch (token.type) {
    case Type.false:
      return fromArray([244]);
    case Type.true:
      return fromArray([245]);
    case Type.null:
      return fromArray([246]);
    case Type.bytes:
      if (!token.value.length) {
        return fromArray([64]);
      }
      return;
    case Type.string:
      if (token.value === "") {
        return fromArray([96]);
      }
      return;
    case Type.array:
      if (token.value === 0) {
        return fromArray([128]);
      }
      return;
    case Type.map:
      if (token.value === 0) {
        return fromArray([160]);
      }
      return;
    case Type.uint:
      if (token.value < 24) {
        return fromArray([Number(token.value)]);
      }
      return;
    case Type.negint:
      if (token.value >= -24) {
        return fromArray([31 - Number(token.value)]);
      }
  }
}
var jump, quick;
var init_jump = __esm({
  "node_modules/cborg/esm/lib/jump.js"() {
    init_esbuild_shims();
    init_token();
    init_uint();
    init_negint();
    init_bytes2();
    init_string();
    init_array();
    init_map();
    init_tag();
    init_float();
    init_common();
    init_byte_utils();
    jump = [];
    for (let i = 0; i <= 23; i++) {
      jump[i] = invalidMinor;
    }
    jump[24] = decodeUint8;
    jump[25] = decodeUint16;
    jump[26] = decodeUint32;
    jump[27] = decodeUint64;
    jump[28] = invalidMinor;
    jump[29] = invalidMinor;
    jump[30] = invalidMinor;
    jump[31] = invalidMinor;
    for (let i = 32; i <= 55; i++) {
      jump[i] = invalidMinor;
    }
    jump[56] = decodeNegint8;
    jump[57] = decodeNegint16;
    jump[58] = decodeNegint32;
    jump[59] = decodeNegint64;
    jump[60] = invalidMinor;
    jump[61] = invalidMinor;
    jump[62] = invalidMinor;
    jump[63] = invalidMinor;
    for (let i = 64; i <= 87; i++) {
      jump[i] = decodeBytesCompact;
    }
    jump[88] = decodeBytes8;
    jump[89] = decodeBytes16;
    jump[90] = decodeBytes32;
    jump[91] = decodeBytes64;
    jump[92] = invalidMinor;
    jump[93] = invalidMinor;
    jump[94] = invalidMinor;
    jump[95] = errorer("indefinite length bytes/strings are not supported");
    for (let i = 96; i <= 119; i++) {
      jump[i] = decodeStringCompact;
    }
    jump[120] = decodeString8;
    jump[121] = decodeString16;
    jump[122] = decodeString32;
    jump[123] = decodeString64;
    jump[124] = invalidMinor;
    jump[125] = invalidMinor;
    jump[126] = invalidMinor;
    jump[127] = errorer("indefinite length bytes/strings are not supported");
    for (let i = 128; i <= 151; i++) {
      jump[i] = decodeArrayCompact;
    }
    jump[152] = decodeArray8;
    jump[153] = decodeArray16;
    jump[154] = decodeArray32;
    jump[155] = decodeArray64;
    jump[156] = invalidMinor;
    jump[157] = invalidMinor;
    jump[158] = invalidMinor;
    jump[159] = decodeArrayIndefinite;
    for (let i = 160; i <= 183; i++) {
      jump[i] = decodeMapCompact;
    }
    jump[184] = decodeMap8;
    jump[185] = decodeMap16;
    jump[186] = decodeMap32;
    jump[187] = decodeMap64;
    jump[188] = invalidMinor;
    jump[189] = invalidMinor;
    jump[190] = invalidMinor;
    jump[191] = decodeMapIndefinite;
    for (let i = 192; i <= 215; i++) {
      jump[i] = decodeTagCompact;
    }
    jump[216] = decodeTag8;
    jump[217] = decodeTag16;
    jump[218] = decodeTag32;
    jump[219] = decodeTag64;
    jump[220] = invalidMinor;
    jump[221] = invalidMinor;
    jump[222] = invalidMinor;
    jump[223] = invalidMinor;
    for (let i = 224; i <= 243; i++) {
      jump[i] = errorer("simple values are not supported");
    }
    jump[244] = invalidMinor;
    jump[245] = invalidMinor;
    jump[246] = invalidMinor;
    jump[247] = decodeUndefined;
    jump[248] = errorer("simple values are not supported");
    jump[249] = decodeFloat16;
    jump[250] = decodeFloat32;
    jump[251] = decodeFloat64;
    jump[252] = invalidMinor;
    jump[253] = invalidMinor;
    jump[254] = invalidMinor;
    jump[255] = decodeBreak;
    quick = [];
    for (let i = 0; i < 24; i++) {
      quick[i] = new Token(Type.uint, i, 1);
    }
    for (let i = -1; i >= -24; i--) {
      quick[31 - i] = new Token(Type.negint, i, 1);
    }
    quick[64] = new Token(Type.bytes, new Uint8Array(0), 1);
    quick[96] = new Token(Type.string, "", 1);
    quick[128] = new Token(Type.array, 0, 1);
    quick[160] = new Token(Type.map, 0, 1);
    quick[244] = new Token(Type.false, false, 1);
    quick[245] = new Token(Type.true, true, 1);
    quick[246] = new Token(Type.null, null, 1);
  }
});

// node_modules/cborg/esm/lib/encode.js
function makeCborEncoders() {
  const encoders = [];
  encoders[Type.uint.major] = encodeUint;
  encoders[Type.negint.major] = encodeNegint;
  encoders[Type.bytes.major] = encodeBytes;
  encoders[Type.string.major] = encodeString;
  encoders[Type.array.major] = encodeArray;
  encoders[Type.map.major] = encodeMap;
  encoders[Type.tag.major] = encodeTag;
  encoders[Type.float.major] = encodeFloat;
  return encoders;
}
function objectToTokens(obj, options = {}, refStack) {
  const typ = is(obj);
  const customTypeEncoder = options && options.typeEncoders && options.typeEncoders[typ] || typeEncoders[typ];
  if (typeof customTypeEncoder === "function") {
    const tokens = customTypeEncoder(obj, typ, options, refStack);
    if (tokens != null) {
      return tokens;
    }
  }
  const typeEncoder = typeEncoders[typ];
  if (!typeEncoder) {
    throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
  }
  return typeEncoder(obj, typ, options, refStack);
}
function sortMapEntries(entries, options) {
  if (options.mapSorter) {
    entries.sort(options.mapSorter);
  }
}
function mapSorter(e1, e2) {
  const keyToken1 = Array.isArray(e1[0]) ? e1[0][0] : e1[0];
  const keyToken2 = Array.isArray(e2[0]) ? e2[0][0] : e2[0];
  if (keyToken1.type !== keyToken2.type) {
    return keyToken1.type.compare(keyToken2.type);
  }
  const major = keyToken1.type.major;
  const tcmp = cborEncoders[major].compareTokens(keyToken1, keyToken2);
  if (tcmp === 0) {
    console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone");
  }
  return tcmp;
}
function tokensToEncoded(buf2, tokens, encoders, options) {
  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      tokensToEncoded(buf2, token, encoders, options);
    }
  } else {
    encoders[tokens.type.major](buf2, tokens, options);
  }
}
function encodeCustom(data, encoders, options) {
  const tokens = objectToTokens(data, options);
  if (!Array.isArray(tokens) && options.quickEncodeToken) {
    const quickBytes = options.quickEncodeToken(tokens);
    if (quickBytes) {
      return quickBytes;
    }
    const encoder = encoders[tokens.type.major];
    if (encoder.encodedSize) {
      const size = encoder.encodedSize(tokens, options);
      const buf2 = new Bl(size);
      encoder(buf2, tokens, options);
      if (buf2.chunks.length !== 1) {
        throw new Error(`Unexpected error: pre-calculated length for ${tokens} was wrong`);
      }
      return asU8A(buf2.chunks[0]);
    }
  }
  buf.reset();
  tokensToEncoded(buf, tokens, encoders, options);
  return buf.toBytes(true);
}
function encode5(data, options) {
  options = Object.assign({}, defaultEncodeOptions, options);
  return encodeCustom(data, cborEncoders, options);
}
var defaultEncodeOptions, cborEncoders, buf, Ref, simpleTokens, typeEncoders;
var init_encode = __esm({
  "node_modules/cborg/esm/lib/encode.js"() {
    init_esbuild_shims();
    init_is();
    init_token();
    init_bl();
    init_common();
    init_jump();
    init_byte_utils();
    init_uint();
    init_negint();
    init_bytes2();
    init_string();
    init_array();
    init_map();
    init_tag();
    init_float();
    defaultEncodeOptions = {
      float64: false,
      mapSorter,
      quickEncodeToken
    };
    cborEncoders = makeCborEncoders();
    buf = new Bl();
    Ref = class _Ref {
      constructor(obj, parent) {
        this.obj = obj;
        this.parent = parent;
      }
      includes(obj) {
        let p2 = this;
        do {
          if (p2.obj === obj) {
            return true;
          }
        } while (p2 = p2.parent);
        return false;
      }
      static createCheck(stack, obj) {
        if (stack && stack.includes(obj)) {
          throw new Error(`${encodeErrPrefix} object contains circular references`);
        }
        return new _Ref(obj, stack);
      }
    };
    simpleTokens = {
      null: new Token(Type.null, null),
      undefined: new Token(Type.undefined, void 0),
      true: new Token(Type.true, true),
      false: new Token(Type.false, false),
      emptyArray: new Token(Type.array, 0),
      emptyMap: new Token(Type.map, 0)
    };
    typeEncoders = {
      number(obj, _typ, _options, _refStack) {
        if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
          return new Token(Type.float, obj);
        } else if (obj >= 0) {
          return new Token(Type.uint, obj);
        } else {
          return new Token(Type.negint, obj);
        }
      },
      bigint(obj, _typ, _options, _refStack) {
        if (obj >= BigInt(0)) {
          return new Token(Type.uint, obj);
        } else {
          return new Token(Type.negint, obj);
        }
      },
      Uint8Array(obj, _typ, _options, _refStack) {
        return new Token(Type.bytes, obj);
      },
      string(obj, _typ, _options, _refStack) {
        return new Token(Type.string, obj);
      },
      boolean(obj, _typ, _options, _refStack) {
        return obj ? simpleTokens.true : simpleTokens.false;
      },
      null(_obj, _typ, _options, _refStack) {
        return simpleTokens.null;
      },
      undefined(_obj, _typ, _options, _refStack) {
        return simpleTokens.undefined;
      },
      ArrayBuffer(obj, _typ, _options, _refStack) {
        return new Token(Type.bytes, new Uint8Array(obj));
      },
      DataView(obj, _typ, _options, _refStack) {
        return new Token(Type.bytes, new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
      },
      Array(obj, _typ, options, refStack) {
        if (!obj.length) {
          if (options.addBreakTokens === true) {
            return [
              simpleTokens.emptyArray,
              new Token(Type.break)
            ];
          }
          return simpleTokens.emptyArray;
        }
        refStack = Ref.createCheck(refStack, obj);
        const entries = [];
        let i = 0;
        for (const e2 of obj) {
          entries[i++] = objectToTokens(e2, options, refStack);
        }
        if (options.addBreakTokens) {
          return [
            new Token(Type.array, obj.length),
            entries,
            new Token(Type.break)
          ];
        }
        return [
          new Token(Type.array, obj.length),
          entries
        ];
      },
      Object(obj, typ, options, refStack) {
        const isMap = typ !== "Object";
        const keys = isMap ? obj.keys() : Object.keys(obj);
        const length2 = isMap ? obj.size : keys.length;
        if (!length2) {
          if (options.addBreakTokens === true) {
            return [
              simpleTokens.emptyMap,
              new Token(Type.break)
            ];
          }
          return simpleTokens.emptyMap;
        }
        refStack = Ref.createCheck(refStack, obj);
        const entries = [];
        let i = 0;
        for (const key of keys) {
          entries[i++] = [
            objectToTokens(key, options, refStack),
            objectToTokens(isMap ? obj.get(key) : obj[key], options, refStack)
          ];
        }
        sortMapEntries(entries, options);
        if (options.addBreakTokens) {
          return [
            new Token(Type.map, length2),
            entries,
            new Token(Type.break)
          ];
        }
        return [
          new Token(Type.map, length2),
          entries
        ];
      }
    };
    typeEncoders.Map = typeEncoders.Object;
    typeEncoders.Buffer = typeEncoders.Uint8Array;
    for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) {
      typeEncoders[`${typ}Array`] = typeEncoders.DataView;
    }
  }
});

// node_modules/cborg/esm/lib/decode.js
function tokenToArray(token, tokeniser, options) {
  const arr = [];
  for (let i = 0; i < token.value; i++) {
    const value = tokensToObject(tokeniser, options);
    if (value === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`);
    }
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`);
    }
    arr[i] = value;
  }
  return arr;
}
function tokenToMap(token, tokeniser, options) {
  const useMaps = options.useMaps === true;
  const obj = useMaps ? void 0 : {};
  const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
  for (let i = 0; i < token.value; i++) {
    const key = tokensToObject(tokeniser, options);
    if (key === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`);
    }
    if (key === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
    }
    if (useMaps !== true && typeof key !== "string") {
      throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof key})`);
    }
    if (options.rejectDuplicateMapKeys === true) {
      if (useMaps && m.has(key) || !useMaps && key in obj) {
        throw new Error(`${decodeErrPrefix} found repeat map key "${key}"`);
      }
    }
    const value = tokensToObject(tokeniser, options);
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
    }
    if (useMaps) {
      m.set(key, value);
    } else {
      obj[key] = value;
    }
  }
  return useMaps ? m : obj;
}
function tokensToObject(tokeniser, options) {
  if (tokeniser.done()) {
    return DONE;
  }
  const token = tokeniser.next();
  if (token.type === Type.break) {
    return BREAK;
  }
  if (token.type.terminal) {
    return token.value;
  }
  if (token.type === Type.array) {
    return tokenToArray(token, tokeniser, options);
  }
  if (token.type === Type.map) {
    return tokenToMap(token, tokeniser, options);
  }
  if (token.type === Type.tag) {
    if (options.tags && typeof options.tags[token.value] === "function") {
      const tagged = tokensToObject(tokeniser, options);
      return options.tags[token.value](tagged);
    }
    throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`);
  }
  throw new Error("unsupported");
}
function decode6(data, options) {
  if (!(data instanceof Uint8Array)) {
    throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
  }
  options = Object.assign({}, defaultDecodeOptions, options);
  const tokeniser = options.tokenizer || new Tokeniser(data, options);
  const decoded = tokensToObject(tokeniser, options);
  if (decoded === DONE) {
    throw new Error(`${decodeErrPrefix} did not find any content to decode`);
  }
  if (decoded === BREAK) {
    throw new Error(`${decodeErrPrefix} got unexpected break`);
  }
  if (!tokeniser.done()) {
    throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
  }
  return decoded;
}
var defaultDecodeOptions, Tokeniser, DONE, BREAK;
var init_decode = __esm({
  "node_modules/cborg/esm/lib/decode.js"() {
    init_esbuild_shims();
    init_common();
    init_token();
    init_jump();
    defaultDecodeOptions = {
      strict: false,
      allowIndefinite: true,
      allowUndefined: true,
      allowBigInt: true
    };
    Tokeniser = class {
      constructor(data, options = {}) {
        this.pos = 0;
        this.data = data;
        this.options = options;
      }
      done() {
        return this.pos >= this.data.length;
      }
      next() {
        const byt = this.data[this.pos];
        let token = quick[byt];
        if (token === void 0) {
          const decoder = jump[byt];
          if (!decoder) {
            throw new Error(`${decodeErrPrefix} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
          }
          const minor = byt & 31;
          token = decoder(this.data, this.pos, minor, this.options);
        }
        this.pos += token.encodedLength;
        return token;
      }
    };
    DONE = Symbol.for("DONE");
    BREAK = Symbol.for("BREAK");
  }
});

// node_modules/cborg/esm/cborg.js
var init_cborg = __esm({
  "node_modules/cborg/esm/cborg.js"() {
    init_esbuild_shims();
    init_encode();
    init_decode();
    init_token();
  }
});

// node_modules/long/src/long.js
var require_long = __commonJS({
  "node_modules/long/src/long.js"(exports2, module2) {
    init_esbuild_shims();
    module2.exports = Long2;
    var wasm = null;
    try {
      wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        13,
        2,
        96,
        0,
        1,
        127,
        96,
        4,
        127,
        127,
        127,
        127,
        1,
        127,
        3,
        7,
        6,
        0,
        1,
        1,
        1,
        1,
        1,
        6,
        6,
        1,
        127,
        1,
        65,
        0,
        11,
        7,
        50,
        6,
        3,
        109,
        117,
        108,
        0,
        1,
        5,
        100,
        105,
        118,
        95,
        115,
        0,
        2,
        5,
        100,
        105,
        118,
        95,
        117,
        0,
        3,
        5,
        114,
        101,
        109,
        95,
        115,
        0,
        4,
        5,
        114,
        101,
        109,
        95,
        117,
        0,
        5,
        8,
        103,
        101,
        116,
        95,
        104,
        105,
        103,
        104,
        0,
        0,
        10,
        191,
        1,
        6,
        4,
        0,
        35,
        0,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        126,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        127,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        128,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        129,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        130,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11
      ])), {}).exports;
    } catch (e2) {
    }
    function Long2(low, high, unsigned) {
      this.low = low | 0;
      this.high = high | 0;
      this.unsigned = !!unsigned;
    }
    Long2.prototype.__isLong__;
    Object.defineProperty(Long2.prototype, "__isLong__", { value: true });
    function isLong(obj) {
      return (obj && obj["__isLong__"]) === true;
    }
    Long2.isLong = isLong;
    var INT_CACHE = {};
    var UINT_CACHE = {};
    function fromInt(value, unsigned) {
      var obj, cachedObj, cache;
      if (unsigned) {
        value >>>= 0;
        if (cache = 0 <= value && value < 256) {
          cachedObj = UINT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
          UINT_CACHE[value] = obj;
        return obj;
      } else {
        value |= 0;
        if (cache = -128 <= value && value < 128) {
          cachedObj = INT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
          INT_CACHE[value] = obj;
        return obj;
      }
    }
    Long2.fromInt = fromInt;
    function fromNumber(value, unsigned) {
      if (isNaN(value))
        return unsigned ? UZERO : ZERO;
      if (unsigned) {
        if (value < 0)
          return UZERO;
        if (value >= TWO_PWR_64_DBL)
          return MAX_UNSIGNED_VALUE;
      } else {
        if (value <= -TWO_PWR_63_DBL)
          return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
          return MAX_VALUE;
      }
      if (value < 0)
        return fromNumber(-value, unsigned).neg();
      return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    Long2.fromNumber = fromNumber;
    function fromBits(lowBits, highBits, unsigned) {
      return new Long2(lowBits, highBits, unsigned);
    }
    Long2.fromBits = fromBits;
    var pow_dbl = Math.pow;
    function fromString4(str, unsigned, radix) {
      if (str.length === 0)
        throw Error("empty string");
      if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
      if (typeof unsigned === "number") {
        radix = unsigned, unsigned = false;
      } else {
        unsigned = !!unsigned;
      }
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      var p2;
      if ((p2 = str.indexOf("-")) > 0)
        throw Error("interior hyphen");
      else if (p2 === 0) {
        return fromString4(str.substring(1), unsigned, radix).neg();
      }
      var radixToPower = fromNumber(pow_dbl(radix, 8));
      var result = ZERO;
      for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = fromNumber(pow_dbl(radix, size));
          result = result.mul(power).add(fromNumber(value));
        } else {
          result = result.mul(radixToPower);
          result = result.add(fromNumber(value));
        }
      }
      result.unsigned = unsigned;
      return result;
    }
    Long2.fromString = fromString4;
    function fromValue(val, unsigned) {
      if (typeof val === "number")
        return fromNumber(val, unsigned);
      if (typeof val === "string")
        return fromString4(val, unsigned);
      return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    Long2.fromValue = fromValue;
    var TWO_PWR_16_DBL = 1 << 16;
    var TWO_PWR_24_DBL = 1 << 24;
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
    var ZERO = fromInt(0);
    Long2.ZERO = ZERO;
    var UZERO = fromInt(0, true);
    Long2.UZERO = UZERO;
    var ONE = fromInt(1);
    Long2.ONE = ONE;
    var UONE = fromInt(1, true);
    Long2.UONE = UONE;
    var NEG_ONE = fromInt(-1);
    Long2.NEG_ONE = NEG_ONE;
    var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
    Long2.MAX_VALUE = MAX_VALUE;
    var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
    Long2.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
    var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
    Long2.MIN_VALUE = MIN_VALUE;
    var LongPrototype = Long2.prototype;
    LongPrototype.toInt = function toInt() {
      return this.unsigned ? this.low >>> 0 : this.low;
    };
    LongPrototype.toNumber = function toNumber() {
      if (this.unsigned)
        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    LongPrototype.toString = function toString4(radix) {
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      if (this.isZero())
        return "0";
      if (this.isNegative()) {
        if (this.eq(MIN_VALUE)) {
          var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
          return div.toString(radix) + rem1.toInt().toString(radix);
        } else
          return "-" + this.neg().toString(radix);
      }
      var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
      var result = "";
      while (true) {
        var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
          return digits + result;
        else {
          while (digits.length < 6)
            digits = "0" + digits;
          result = "" + digits + result;
        }
      }
    };
    LongPrototype.getHighBits = function getHighBits() {
      return this.high;
    };
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
      return this.high >>> 0;
    };
    LongPrototype.getLowBits = function getLowBits() {
      return this.low;
    };
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
      return this.low >>> 0;
    };
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
      if (this.isNegative())
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
      var val = this.high != 0 ? this.high : this.low;
      for (var bit = 31; bit > 0; bit--)
        if ((val & 1 << bit) != 0)
          break;
      return this.high != 0 ? bit + 33 : bit + 1;
    };
    LongPrototype.isZero = function isZero() {
      return this.high === 0 && this.low === 0;
    };
    LongPrototype.eqz = LongPrototype.isZero;
    LongPrototype.isNegative = function isNegative() {
      return !this.unsigned && this.high < 0;
    };
    LongPrototype.isPositive = function isPositive() {
      return this.unsigned || this.high >= 0;
    };
    LongPrototype.isOdd = function isOdd() {
      return (this.low & 1) === 1;
    };
    LongPrototype.isEven = function isEven() {
      return (this.low & 1) === 0;
    };
    LongPrototype.equals = function equals4(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
        return false;
      return this.high === other.high && this.low === other.low;
    };
    LongPrototype.eq = LongPrototype.equals;
    LongPrototype.notEquals = function notEquals(other) {
      return !this.eq(
        /* validates */
        other
      );
    };
    LongPrototype.neq = LongPrototype.notEquals;
    LongPrototype.ne = LongPrototype.notEquals;
    LongPrototype.lessThan = function lessThan(other) {
      return this.comp(
        /* validates */
        other
      ) < 0;
    };
    LongPrototype.lt = LongPrototype.lessThan;
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) <= 0;
    };
    LongPrototype.lte = LongPrototype.lessThanOrEqual;
    LongPrototype.le = LongPrototype.lessThanOrEqual;
    LongPrototype.greaterThan = function greaterThan(other) {
      return this.comp(
        /* validates */
        other
      ) > 0;
    };
    LongPrototype.gt = LongPrototype.greaterThan;
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) >= 0;
    };
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;
    LongPrototype.ge = LongPrototype.greaterThanOrEqual;
    LongPrototype.compare = function compare2(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.eq(other))
        return 0;
      var thisNeg = this.isNegative(), otherNeg = other.isNegative();
      if (thisNeg && !otherNeg)
        return -1;
      if (!thisNeg && otherNeg)
        return 1;
      if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
      return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };
    LongPrototype.comp = LongPrototype.compare;
    LongPrototype.negate = function negate() {
      if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
      return this.not().add(ONE);
    };
    LongPrototype.neg = LongPrototype.negate;
    LongPrototype.add = function add(addend) {
      if (!isLong(addend))
        addend = fromValue(addend);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = addend.high >>> 16;
      var b32 = addend.high & 65535;
      var b16 = addend.low >>> 16;
      var b00 = addend.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 + b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.subtract = function subtract(subtrahend) {
      if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
      return this.add(subtrahend.neg());
    };
    LongPrototype.sub = LongPrototype.subtract;
    LongPrototype.multiply = function multiply(multiplier) {
      if (this.isZero())
        return ZERO;
      if (!isLong(multiplier))
        multiplier = fromValue(multiplier);
      if (wasm) {
        var low = wasm.mul(
          this.low,
          this.high,
          multiplier.low,
          multiplier.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (multiplier.isZero())
        return ZERO;
      if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
      if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;
      if (this.isNegative()) {
        if (multiplier.isNegative())
          return this.neg().mul(multiplier.neg());
        else
          return this.neg().mul(multiplier).neg();
      } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();
      if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = multiplier.high >>> 16;
      var b32 = multiplier.high & 65535;
      var b16 = multiplier.low >>> 16;
      var b00 = multiplier.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.mul = LongPrototype.multiply;
    LongPrototype.divide = function divide(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (divisor.isZero())
        throw Error("division by zero");
      if (wasm) {
        if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
          return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
      var approx, rem, res;
      if (!this.unsigned) {
        if (this.eq(MIN_VALUE)) {
          if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
            return MIN_VALUE;
          else if (divisor.eq(MIN_VALUE))
            return ONE;
          else {
            var halfThis = this.shr(1);
            approx = halfThis.div(divisor).shl(1);
            if (approx.eq(ZERO)) {
              return divisor.isNegative() ? ONE : NEG_ONE;
            } else {
              rem = this.sub(divisor.mul(approx));
              res = approx.add(rem.div(divisor));
              return res;
            }
          }
        } else if (divisor.eq(MIN_VALUE))
          return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
          if (divisor.isNegative())
            return this.neg().div(divisor.neg());
          return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
          return this.div(divisor.neg()).neg();
        res = ZERO;
      } else {
        if (!divisor.unsigned)
          divisor = divisor.toUnsigned();
        if (divisor.gt(this))
          return UZERO;
        if (divisor.gt(this.shru(1)))
          return UONE;
        res = UZERO;
      }
      rem = this;
      while (rem.gte(divisor)) {
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
        var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
          approx -= delta;
          approxRes = fromNumber(approx, this.unsigned);
          approxRem = approxRes.mul(divisor);
        }
        if (approxRes.isZero())
          approxRes = ONE;
        res = res.add(approxRes);
        rem = rem.sub(approxRem);
      }
      return res;
    };
    LongPrototype.div = LongPrototype.divide;
    LongPrototype.modulo = function modulo(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      return this.sub(this.div(divisor).mul(divisor));
    };
    LongPrototype.mod = LongPrototype.modulo;
    LongPrototype.rem = LongPrototype.modulo;
    LongPrototype.not = function not() {
      return fromBits(~this.low, ~this.high, this.unsigned);
    };
    LongPrototype.and = function and(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    LongPrototype.or = function or2(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    LongPrototype.xor = function xor(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
      else
        return fromBits(0, this.low << numBits - 32, this.unsigned);
    };
    LongPrototype.shl = LongPrototype.shiftLeft;
    LongPrototype.shiftRight = function shiftRight(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
      else
        return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };
    LongPrototype.shr = LongPrototype.shiftRight;
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      numBits &= 63;
      if (numBits === 0)
        return this;
      else {
        var high = this.high;
        if (numBits < 32) {
          var low = this.low;
          return fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
        } else if (numBits === 32)
          return fromBits(high, 0, this.unsigned);
        else
          return fromBits(high >>> numBits - 32, 0, this.unsigned);
      }
    };
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;
    LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
    LongPrototype.toSigned = function toSigned() {
      if (!this.unsigned)
        return this;
      return fromBits(this.low, this.high, false);
    };
    LongPrototype.toUnsigned = function toUnsigned() {
      if (this.unsigned)
        return this;
      return fromBits(this.low, this.high, true);
    };
    LongPrototype.toBytes = function toBytes(le) {
      return le ? this.toBytesLE() : this.toBytesBE();
    };
    LongPrototype.toBytesLE = function toBytesLE() {
      var hi = this.high, lo = this.low;
      return [
        lo & 255,
        lo >>> 8 & 255,
        lo >>> 16 & 255,
        lo >>> 24,
        hi & 255,
        hi >>> 8 & 255,
        hi >>> 16 & 255,
        hi >>> 24
      ];
    };
    LongPrototype.toBytesBE = function toBytesBE() {
      var hi = this.high, lo = this.low;
      return [
        hi >>> 24,
        hi >>> 16 & 255,
        hi >>> 8 & 255,
        hi & 255,
        lo >>> 24,
        lo >>> 16 & 255,
        lo >>> 8 & 255,
        lo & 255
      ];
    };
    Long2.fromBytes = function fromBytes(bytes, unsigned, le) {
      return le ? Long2.fromBytesLE(bytes, unsigned) : Long2.fromBytesBE(bytes, unsigned);
    };
    Long2.fromBytesLE = function fromBytesLE(bytes, unsigned) {
      return new Long2(
        bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
        bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
        unsigned
      );
    };
    Long2.fromBytesBE = function fromBytesBE(bytes, unsigned) {
      return new Long2(
        bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
        bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
        unsigned
      );
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    init_esbuild_shims();
    var s = 1e3;
    var m = s * 60;
    var h2 = m * 60;
    var d2 = h2 * 24;
    var w2 = d2 * 7;
    var y2 = d2 * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n2 = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n2 * y2;
        case "weeks":
        case "week":
        case "w":
          return n2 * w2;
        case "days":
        case "day":
        case "d":
          return n2 * d2;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n2 * h2;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n2 * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n2 * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n2;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d2) {
        return Math.round(ms / d2) + "d";
      }
      if (msAbs >= h2) {
        return Math.round(ms / h2) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d2) {
        return plural(ms, msAbs, d2, "day");
      }
      if (msAbs >= h2) {
        return plural(ms, msAbs, h2, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n2, name2) {
      var isPlural = msAbs >= n2 * 1.5;
      return Math.round(ms / n2) + " " + name2 + (isPlural ? "s" : "");
    }
  }
});

// node_modules/ipns/node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/ipns/node_modules/debug/src/common.js"(exports2, module2) {
    init_esbuild_shims();
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce2;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace2) {
        let hash = 0;
        for (let i = 0; i < namespace2.length; i++) {
          hash = (hash << 5) - hash + namespace2.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace2) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self2 = debug2;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug2.namespace = namespace2;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace2);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace2);
            }
            return enabledCache;
          },
          set: (v2) => {
            enableOverride = v2;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace2, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace2);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(" ", ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace2) => "-" + namespace2)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name2) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name2, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name2, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce2(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/ipns/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/ipns/node_modules/debug/src/browser.js"(exports2, module2) {
    init_esbuild_shims();
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v2) {
      try {
        return JSON.stringify(v2);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/ipns/esm/src/pb/ipns.js
var import_minimal, $Reader, $Writer, $util, $root, IpnsEntry;
var init_ipns = __esm({
  "node_modules/ipns/esm/src/pb/ipns.js"() {
    init_esbuild_shims();
    import_minimal = __toESM(require_minimal2(), 1);
    $Reader = import_minimal.default.Reader;
    $Writer = import_minimal.default.Writer;
    $util = import_minimal.default.util;
    $root = import_minimal.default.roots["ipfs-ipns"] || (import_minimal.default.roots["ipfs-ipns"] = {});
    IpnsEntry = $root.IpnsEntry = (() => {
      function IpnsEntry2(p2) {
        if (p2) {
          for (var ks = Object.keys(p2), i = 0; i < ks.length; ++i)
            if (p2[ks[i]] != null)
              this[ks[i]] = p2[ks[i]];
        }
      }
      IpnsEntry2.prototype.value = $util.newBuffer([]);
      IpnsEntry2.prototype.signature = $util.newBuffer([]);
      IpnsEntry2.prototype.validityType = 0;
      IpnsEntry2.prototype.validity = $util.newBuffer([]);
      IpnsEntry2.prototype.sequence = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
      IpnsEntry2.prototype.ttl = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
      IpnsEntry2.prototype.pubKey = $util.newBuffer([]);
      IpnsEntry2.prototype.signatureV2 = $util.newBuffer([]);
      IpnsEntry2.prototype.data = $util.newBuffer([]);
      IpnsEntry2.encode = function encode6(m, w2) {
        if (!w2)
          w2 = $Writer.create();
        if (m.value != null && Object.hasOwnProperty.call(m, "value"))
          w2.uint32(10).bytes(m.value);
        if (m.signature != null && Object.hasOwnProperty.call(m, "signature"))
          w2.uint32(18).bytes(m.signature);
        if (m.validityType != null && Object.hasOwnProperty.call(m, "validityType"))
          w2.uint32(24).int32(m.validityType);
        if (m.validity != null && Object.hasOwnProperty.call(m, "validity"))
          w2.uint32(34).bytes(m.validity);
        if (m.sequence != null && Object.hasOwnProperty.call(m, "sequence"))
          w2.uint32(40).uint64(m.sequence);
        if (m.ttl != null && Object.hasOwnProperty.call(m, "ttl"))
          w2.uint32(48).uint64(m.ttl);
        if (m.pubKey != null && Object.hasOwnProperty.call(m, "pubKey"))
          w2.uint32(58).bytes(m.pubKey);
        if (m.signatureV2 != null && Object.hasOwnProperty.call(m, "signatureV2"))
          w2.uint32(66).bytes(m.signatureV2);
        if (m.data != null && Object.hasOwnProperty.call(m, "data"))
          w2.uint32(74).bytes(m.data);
        return w2;
      };
      IpnsEntry2.decode = function decode7(r, l2) {
        if (!(r instanceof $Reader))
          r = $Reader.create(r);
        var c = l2 === void 0 ? r.len : r.pos + l2, m = new $root.IpnsEntry();
        while (r.pos < c) {
          var t2 = r.uint32();
          switch (t2 >>> 3) {
            case 1:
              m.value = r.bytes();
              break;
            case 2:
              m.signature = r.bytes();
              break;
            case 3:
              m.validityType = r.int32();
              break;
            case 4:
              m.validity = r.bytes();
              break;
            case 5:
              m.sequence = r.uint64();
              break;
            case 6:
              m.ttl = r.uint64();
              break;
            case 7:
              m.pubKey = r.bytes();
              break;
            case 8:
              m.signatureV2 = r.bytes();
              break;
            case 9:
              m.data = r.bytes();
              break;
            default:
              r.skipType(t2 & 7);
              break;
          }
        }
        return m;
      };
      IpnsEntry2.fromObject = function fromObject(d2) {
        if (d2 instanceof $root.IpnsEntry)
          return d2;
        var m = new $root.IpnsEntry();
        if (d2.value != null) {
          if (typeof d2.value === "string")
            $util.base64.decode(d2.value, m.value = $util.newBuffer($util.base64.length(d2.value)), 0);
          else if (d2.value.length)
            m.value = d2.value;
        }
        if (d2.signature != null) {
          if (typeof d2.signature === "string")
            $util.base64.decode(d2.signature, m.signature = $util.newBuffer($util.base64.length(d2.signature)), 0);
          else if (d2.signature.length)
            m.signature = d2.signature;
        }
        switch (d2.validityType) {
          case "EOL":
          case 0:
            m.validityType = 0;
            break;
        }
        if (d2.validity != null) {
          if (typeof d2.validity === "string")
            $util.base64.decode(d2.validity, m.validity = $util.newBuffer($util.base64.length(d2.validity)), 0);
          else if (d2.validity.length)
            m.validity = d2.validity;
        }
        if (d2.sequence != null) {
          if ($util.Long)
            (m.sequence = $util.Long.fromValue(d2.sequence)).unsigned = true;
          else if (typeof d2.sequence === "string")
            m.sequence = parseInt(d2.sequence, 10);
          else if (typeof d2.sequence === "number")
            m.sequence = d2.sequence;
          else if (typeof d2.sequence === "object")
            m.sequence = new $util.LongBits(d2.sequence.low >>> 0, d2.sequence.high >>> 0).toNumber(true);
        }
        if (d2.ttl != null) {
          if ($util.Long)
            (m.ttl = $util.Long.fromValue(d2.ttl)).unsigned = true;
          else if (typeof d2.ttl === "string")
            m.ttl = parseInt(d2.ttl, 10);
          else if (typeof d2.ttl === "number")
            m.ttl = d2.ttl;
          else if (typeof d2.ttl === "object")
            m.ttl = new $util.LongBits(d2.ttl.low >>> 0, d2.ttl.high >>> 0).toNumber(true);
        }
        if (d2.pubKey != null) {
          if (typeof d2.pubKey === "string")
            $util.base64.decode(d2.pubKey, m.pubKey = $util.newBuffer($util.base64.length(d2.pubKey)), 0);
          else if (d2.pubKey.length)
            m.pubKey = d2.pubKey;
        }
        if (d2.signatureV2 != null) {
          if (typeof d2.signatureV2 === "string")
            $util.base64.decode(d2.signatureV2, m.signatureV2 = $util.newBuffer($util.base64.length(d2.signatureV2)), 0);
          else if (d2.signatureV2.length)
            m.signatureV2 = d2.signatureV2;
        }
        if (d2.data != null) {
          if (typeof d2.data === "string")
            $util.base64.decode(d2.data, m.data = $util.newBuffer($util.base64.length(d2.data)), 0);
          else if (d2.data.length)
            m.data = d2.data;
        }
        return m;
      };
      IpnsEntry2.toObject = function toObject(m, o) {
        if (!o)
          o = {};
        var d2 = {};
        if (o.defaults) {
          if (o.bytes === String)
            d2.value = "";
          else {
            d2.value = [];
            if (o.bytes !== Array)
              d2.value = $util.newBuffer(d2.value);
          }
          if (o.bytes === String)
            d2.signature = "";
          else {
            d2.signature = [];
            if (o.bytes !== Array)
              d2.signature = $util.newBuffer(d2.signature);
          }
          d2.validityType = o.enums === String ? "EOL" : 0;
          if (o.bytes === String)
            d2.validity = "";
          else {
            d2.validity = [];
            if (o.bytes !== Array)
              d2.validity = $util.newBuffer(d2.validity);
          }
          if ($util.Long) {
            var n2 = new $util.Long(0, 0, true);
            d2.sequence = o.longs === String ? n2.toString() : o.longs === Number ? n2.toNumber() : n2;
          } else
            d2.sequence = o.longs === String ? "0" : 0;
          if ($util.Long) {
            var n2 = new $util.Long(0, 0, true);
            d2.ttl = o.longs === String ? n2.toString() : o.longs === Number ? n2.toNumber() : n2;
          } else
            d2.ttl = o.longs === String ? "0" : 0;
          if (o.bytes === String)
            d2.pubKey = "";
          else {
            d2.pubKey = [];
            if (o.bytes !== Array)
              d2.pubKey = $util.newBuffer(d2.pubKey);
          }
          if (o.bytes === String)
            d2.signatureV2 = "";
          else {
            d2.signatureV2 = [];
            if (o.bytes !== Array)
              d2.signatureV2 = $util.newBuffer(d2.signatureV2);
          }
          if (o.bytes === String)
            d2.data = "";
          else {
            d2.data = [];
            if (o.bytes !== Array)
              d2.data = $util.newBuffer(d2.data);
          }
        }
        if (m.value != null && m.hasOwnProperty("value")) {
          d2.value = o.bytes === String ? $util.base64.encode(m.value, 0, m.value.length) : o.bytes === Array ? Array.prototype.slice.call(m.value) : m.value;
        }
        if (m.signature != null && m.hasOwnProperty("signature")) {
          d2.signature = o.bytes === String ? $util.base64.encode(m.signature, 0, m.signature.length) : o.bytes === Array ? Array.prototype.slice.call(m.signature) : m.signature;
        }
        if (m.validityType != null && m.hasOwnProperty("validityType")) {
          d2.validityType = o.enums === String ? $root.IpnsEntry.ValidityType[m.validityType] : m.validityType;
        }
        if (m.validity != null && m.hasOwnProperty("validity")) {
          d2.validity = o.bytes === String ? $util.base64.encode(m.validity, 0, m.validity.length) : o.bytes === Array ? Array.prototype.slice.call(m.validity) : m.validity;
        }
        if (m.sequence != null && m.hasOwnProperty("sequence")) {
          if (typeof m.sequence === "number")
            d2.sequence = o.longs === String ? String(m.sequence) : m.sequence;
          else
            d2.sequence = o.longs === String ? $util.Long.prototype.toString.call(m.sequence) : o.longs === Number ? new $util.LongBits(m.sequence.low >>> 0, m.sequence.high >>> 0).toNumber(true) : m.sequence;
        }
        if (m.ttl != null && m.hasOwnProperty("ttl")) {
          if (typeof m.ttl === "number")
            d2.ttl = o.longs === String ? String(m.ttl) : m.ttl;
          else
            d2.ttl = o.longs === String ? $util.Long.prototype.toString.call(m.ttl) : o.longs === Number ? new $util.LongBits(m.ttl.low >>> 0, m.ttl.high >>> 0).toNumber(true) : m.ttl;
        }
        if (m.pubKey != null && m.hasOwnProperty("pubKey")) {
          d2.pubKey = o.bytes === String ? $util.base64.encode(m.pubKey, 0, m.pubKey.length) : o.bytes === Array ? Array.prototype.slice.call(m.pubKey) : m.pubKey;
        }
        if (m.signatureV2 != null && m.hasOwnProperty("signatureV2")) {
          d2.signatureV2 = o.bytes === String ? $util.base64.encode(m.signatureV2, 0, m.signatureV2.length) : o.bytes === Array ? Array.prototype.slice.call(m.signatureV2) : m.signatureV2;
        }
        if (m.data != null && m.hasOwnProperty("data")) {
          d2.data = o.bytes === String ? $util.base64.encode(m.data, 0, m.data.length) : o.bytes === Array ? Array.prototype.slice.call(m.data) : m.data;
        }
        return d2;
      };
      IpnsEntry2.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, import_minimal.default.util.toJSONOptions);
      };
      IpnsEntry2.ValidityType = function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "EOL"] = 0;
        return values;
      }();
      return IpnsEntry2;
    })();
  }
});

// node_modules/ipns/esm/src/utils.js
function parseRFC3339(time) {
  const rfc3339Matcher = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d+)Z");
  const m = String(time).trim().match(rfc3339Matcher);
  if (!m) {
    throw new Error("Invalid format");
  }
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const date = parseInt(m[3], 10);
  const hour = parseInt(m[4], 10);
  const minute = parseInt(m[5], 10);
  const second = parseInt(m[6], 10);
  const millisecond = parseInt(m[7].slice(0, -6), 10);
  return new Date(Date.UTC(year, month, date, hour, minute, second, millisecond));
}
var init_utils = __esm({
  "node_modules/ipns/esm/src/utils.js"() {
    init_esbuild_shims();
  }
});

// node_modules/ipns/esm/src/errors.js
var ERR_IPNS_EXPIRED_RECORD, ERR_UNRECOGNIZED_VALIDITY, ERR_SIGNATURE_CREATION, ERR_SIGNATURE_VERIFICATION, ERR_UNRECOGNIZED_FORMAT, ERR_INVALID_RECORD_DATA;
var init_errors = __esm({
  "node_modules/ipns/esm/src/errors.js"() {
    init_esbuild_shims();
    ERR_IPNS_EXPIRED_RECORD = "ERR_IPNS_EXPIRED_RECORD";
    ERR_UNRECOGNIZED_VALIDITY = "ERR_UNRECOGNIZED_VALIDITY";
    ERR_SIGNATURE_CREATION = "ERR_SIGNATURE_CREATION";
    ERR_SIGNATURE_VERIFICATION = "ERR_SIGNATURE_VERIFICATION";
    ERR_UNRECOGNIZED_FORMAT = "ERR_UNRECOGNIZED_FORMAT";
    ERR_INVALID_RECORD_DATA = "ERR_INVALID_RECORD_DATA";
  }
});

// node_modules/ipns/esm/src/index.js
var import_timestamp_nano, import_libp2p_crypto, import_peer_id, import_err_code, import_long, import_debug, log, ID_MULTIHASH_CODE, IPNS_PREFIX, namespace, namespaceLength, create2, _create, createCborData, validate, validateCborDataMatchesPbData, sign, getValidityType, ipnsEntryDataForV1Sig, ipnsEntryDataForV2Sig, marshal, unmarshal;
var init_src2 = __esm({
  "node_modules/ipns/esm/src/index.js"() {
    init_esbuild_shims();
    import_timestamp_nano = __toESM(require_timestamp_min(), 1);
    init_key();
    import_libp2p_crypto = __toESM(require_src(), 1);
    import_peer_id = __toESM(require_src2(), 1);
    init_digest();
    init_identity2();
    import_err_code = __toESM(require_err_code(), 1);
    init_base32();
    init_from_string();
    init_to_string();
    init_concat();
    init_equals();
    init_cborg();
    import_long = __toESM(require_long(), 1);
    import_debug = __toESM(require_browser(), 1);
    init_ipns();
    init_utils();
    init_errors();
    log = Object.assign((0, import_debug.default)("jsipns"), { error: (0, import_debug.default)("jsipns:error") });
    ID_MULTIHASH_CODE = identity2.code;
    IPNS_PREFIX = fromString2("/ipns/");
    namespace = "/ipns/";
    namespaceLength = namespace.length;
    create2 = (privateKey, value, seq, lifetime) => {
      const expirationDate = new import_timestamp_nano.default(Date.now() + Number(lifetime));
      const validityType = IpnsEntry.ValidityType.EOL;
      const [ms, ns] = lifetime.toString().split(".");
      const lifetimeNs = BigInt(ms) * BigInt(1e5) + BigInt(ns || 0);
      return _create(privateKey, value, seq, validityType, expirationDate, lifetimeNs);
    };
    _create = async (privateKey, value, seq, validityType, expirationDate, ttl) => {
      seq = BigInt(seq);
      const isoValidity = fromString2(expirationDate.toString());
      const signatureV1 = await sign(privateKey, value, validityType, isoValidity);
      const data = createCborData(value, isoValidity, validityType, seq, ttl);
      const sigData = ipnsEntryDataForV2Sig(data);
      const signatureV2 = await privateKey.sign(sigData);
      const entry = {
        value,
        signature: signatureV1,
        validityType,
        validity: isoValidity,
        sequence: seq,
        ttl,
        signatureV2,
        data
      };
      log(`ipns entry for ${value} created`);
      return entry;
    };
    createCborData = (value, validity, validityType, sequence, ttl) => {
      const data = {
        Value: value,
        Validity: validity,
        ValidityType: validityType,
        Sequence: sequence,
        TTL: ttl
      };
      return encode5(data);
    };
    validate = async (publicKey, entry) => {
      const { value, validityType, validity } = entry;
      let dataForSignature;
      let signature;
      if (entry.signatureV2 && entry.data) {
        signature = entry.signatureV2;
        dataForSignature = ipnsEntryDataForV2Sig(entry.data);
        validateCborDataMatchesPbData(entry);
      } else {
        signature = entry.signature;
        dataForSignature = ipnsEntryDataForV1Sig(value, validityType, validity);
      }
      let isValid;
      try {
        isValid = await publicKey.verify(dataForSignature, signature);
      } catch (err) {
        isValid = false;
      }
      if (!isValid) {
        log.error("record signature verification failed");
        throw (0, import_err_code.default)(new Error("record signature verification failed"), ERR_SIGNATURE_VERIFICATION);
      }
      if (validityType === IpnsEntry.ValidityType.EOL) {
        let validityDate;
        try {
          validityDate = parseRFC3339(toString2(validity));
        } catch (e2) {
          log.error("unrecognized validity format (not an rfc3339 format)");
          throw (0, import_err_code.default)(new Error("unrecognized validity format (not an rfc3339 format)"), ERR_UNRECOGNIZED_FORMAT);
        }
        if (validityDate.getTime() < Date.now()) {
          log.error("record has expired");
          throw (0, import_err_code.default)(new Error("record has expired"), ERR_IPNS_EXPIRED_RECORD);
        }
      } else if (validityType) {
        log.error("unrecognized validity type");
        throw (0, import_err_code.default)(new Error("unrecognized validity type"), ERR_UNRECOGNIZED_VALIDITY);
      }
      log(`ipns entry for ${value} is valid`);
    };
    validateCborDataMatchesPbData = (entry) => {
      if (!entry.data) {
        throw (0, import_err_code.default)(new Error("Record data is missing"), ERR_INVALID_RECORD_DATA);
      }
      const data = decode6(entry.data);
      if (Number.isInteger(data.Sequence)) {
        data.Sequence = BigInt(data.Sequence);
      }
      if (Number.isInteger(data.TTL)) {
        data.TTL = BigInt(data.TTL);
      }
      if (!equals3(data.Value, entry.value)) {
        throw (0, import_err_code.default)(new Error('Field "value" did not match between protobuf and CBOR'), ERR_SIGNATURE_VERIFICATION);
      }
      if (!equals3(data.Validity, entry.validity)) {
        throw (0, import_err_code.default)(new Error('Field "validity" did not match between protobuf and CBOR'), ERR_SIGNATURE_VERIFICATION);
      }
      if (data.ValidityType !== entry.validityType) {
        throw (0, import_err_code.default)(new Error('Field "validityType" did not match between protobuf and CBOR'), ERR_SIGNATURE_VERIFICATION);
      }
      if (data.Sequence !== entry.sequence) {
        throw (0, import_err_code.default)(new Error('Field "sequence" did not match between protobuf and CBOR'), ERR_SIGNATURE_VERIFICATION);
      }
      if (data.TTL !== entry.ttl) {
        throw (0, import_err_code.default)(new Error('Field "ttl" did not match between protobuf and CBOR'), ERR_SIGNATURE_VERIFICATION);
      }
    };
    sign = (privateKey, value, validityType, validity) => {
      try {
        const dataForSignature = ipnsEntryDataForV1Sig(value, validityType, validity);
        return privateKey.sign(dataForSignature);
      } catch (error) {
        log.error("record signature creation failed");
        throw (0, import_err_code.default)(new Error("record signature creation failed: " + error.message), ERR_SIGNATURE_CREATION);
      }
    };
    getValidityType = (validityType) => {
      if (validityType.toString() === "0") {
        return "EOL";
      }
      const error = new Error(`unrecognized validity type ${validityType.toString()}`);
      log.error(error);
      throw (0, import_err_code.default)(error, ERR_UNRECOGNIZED_VALIDITY);
    };
    ipnsEntryDataForV1Sig = (value, validityType, validity) => {
      const validityTypeBuffer = fromString2(getValidityType(validityType));
      return concat([
        value,
        validity,
        validityTypeBuffer
      ]);
    };
    ipnsEntryDataForV2Sig = (data) => {
      const entryData = fromString2("ipns-signature:");
      return concat([
        entryData,
        data
      ]);
    };
    marshal = (obj) => {
      return IpnsEntry.encode({
        ...obj,
        sequence: import_long.default.fromString(obj.sequence.toString()),
        ttl: obj.ttl == null ? void 0 : import_long.default.fromString(obj.ttl.toString())
      }).finish();
    };
    unmarshal = (buf2) => {
      const message = IpnsEntry.decode(buf2);
      const object = IpnsEntry.toObject(message, {
        defaults: false,
        arrays: true,
        objects: false
      });
      return {
        value: object.value,
        signature: object.signature,
        validityType: object.validityType,
        validity: object.validity,
        sequence: Object.hasOwnProperty.call(object, "sequence") ? BigInt(`${object.sequence}`) : 0,
        pubKey: object.pubKey,
        ttl: Object.hasOwnProperty.call(object, "ttl") ? BigInt(`${object.ttl}`) : void 0,
        signatureV2: object.signatureV2,
        data: object.data
      };
    };
  }
});

// node_modules/throttled-queue/dist/throttledQueue.js
var require_throttledQueue = __commonJS({
  "node_modules/throttled-queue/dist/throttledQueue.js"(exports2, module2) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports2, "__esModule", { value: true });
    function throttledQueue(maxRequestsPerInterval, interval, evenlySpaced) {
      if (evenlySpaced === void 0) {
        evenlySpaced = false;
      }
      if (evenlySpaced) {
        interval = interval / maxRequestsPerInterval;
        maxRequestsPerInterval = 1;
      }
      var queue = [];
      var lastIntervalStart = 0;
      var numRequestsPerInterval = 0;
      var timeout;
      var dequeue = function() {
        var intervalEnd = lastIntervalStart + interval;
        var now = Date.now();
        if (now < intervalEnd) {
          timeout !== void 0 && clearTimeout(timeout);
          timeout = setTimeout(dequeue, intervalEnd - now);
          return;
        }
        lastIntervalStart = now;
        numRequestsPerInterval = 0;
        for (var _i = 0, _a = queue.splice(0, maxRequestsPerInterval); _i < _a.length; _i++) {
          var callback = _a[_i];
          numRequestsPerInterval++;
          void callback();
        }
        if (queue.length) {
          timeout = setTimeout(dequeue, interval);
        } else {
          timeout = void 0;
        }
      };
      return function(fn) {
        return new Promise(function(resolve, reject) {
          var callback = function() {
            return Promise.resolve().then(fn).then(resolve).catch(reject);
          };
          var now = Date.now();
          if (timeout === void 0 && now - lastIntervalStart > interval) {
            lastIntervalStart = now;
            numRequestsPerInterval = 0;
          }
          if (numRequestsPerInterval++ < maxRequestsPerInterval) {
            void callback();
          } else {
            queue.push(callback);
            if (timeout === void 0) {
              timeout = setTimeout(dequeue, lastIntervalStart + interval - now);
            }
          }
        });
      };
    }
    module2.exports = throttledQueue;
    exports2.default = throttledQueue;
  }
});

// node_modules/w3name/dist/service.mjs
var import_throttled_queue, e;
var init_service = __esm({
  "node_modules/w3name/dist/service.mjs"() {
    init_esbuild_shims();
    import_throttled_queue = __toESM(require_throttledQueue(), 1);
    e = class {
      constructor(e2 = new URL("https://name.web3.storage/"), o = function() {
        const e3 = (0, import_throttled_queue.default)(30, 1e4);
        return async () => await e3(() => {
        });
      }()) {
        this.endpoint = e2, this.waitForRateLimit = o;
      }
    };
  }
});

// node_modules/@web-std/fetch/src/lib.js
var Headers, Request, Response, lib_default;
var init_lib = __esm({
  "node_modules/@web-std/fetch/src/lib.js"() {
    init_esbuild_shims();
    ({ Headers, Request, Response } = globalThis);
    lib_default = globalThis.fetch.bind(globalThis);
  }
});

// node_modules/w3name/dist/index.mjs
var dist_exports = {};
__export(dist_exports, {
  Name: () => l,
  Revision: () => g,
  WritableName: () => w,
  create: () => p,
  from: () => h,
  increment: () => b,
  parse: () => f,
  publish: () => _,
  resolve: () => q,
  v0: () => v
});
async function p() {
  const e2 = await import_libp2p_crypto2.keys.generateKeyPair("Ed25519", 2048);
  return new w(e2);
}
function f(e2) {
  const t2 = CID.parse(e2, base36);
  if (114 !== t2.code) throw new Error(`Invalid key, expected 114 codec code but got ${t2.code}`);
  const r = import_libp2p_crypto2.keys.unmarshalPublicKey(decode5(t2.multihash.bytes).bytes);
  return new l(r);
}
async function h(e2) {
  const t2 = await import_libp2p_crypto2.keys.unmarshalPrivateKey(e2);
  return new w(t2);
}
async function v(e2, t2) {
  return new g(e2, t2, 0n, d());
}
async function b(e2, t2) {
  const n2 = e2.sequence + 1n;
  return new g(e2.name, t2, n2, d());
}
async function _(n2, r, i = y) {
  const a = new URL(`name/${n2.name.toString()}`, i.endpoint), s = await create2(r, fromString2(n2.value), n2.sequence, new Date(n2.validity).getTime() - Date.now());
  await i.waitForRateLimit(), await S(lib_default(a.toString(), { method: "POST", body: toString2(marshal(s), "base64pad") }));
}
async function q(r, i = y) {
  const c = new URL(`name/${r.toString()}`, i.endpoint);
  await i.waitForRateLimit();
  const u = await S(lib_default(c.toString())), { record: d2 } = await u.json(), l2 = unmarshal(fromString2(d2, "base64pad")), w2 = CID.decode(r.bytes), p2 = import_libp2p_crypto2.keys.unmarshalPublicKey(decode5(w2.multihash.bytes).bytes);
  return await validate(p2, l2), new g(r, toString2(l2.value), l2.sequence, toString2(l2.validity));
}
async function S(e2) {
  const t2 = await e2;
  if (t2.ok) return t2;
  let n2;
  try {
    const e3 = await t2.json();
    n2 = new Error(e3.message);
  } catch (e3) {
    n2 = new Error(`unexpected response from API, cannot parse error response. Received status: ${t2.status}`);
  }
  throw n2;
}
var import_libp2p_crypto2, d, y, l, w, g;
var init_dist = __esm({
  "node_modules/w3name/dist/index.mjs"() {
    init_esbuild_shims();
    init_from_string();
    init_to_string();
    import_libp2p_crypto2 = __toESM(require_src(), 1);
    init_identity2();
    init_base36();
    init_cid();
    init_digest();
    init_src2();
    init_cborg();
    init_service();
    init_lib();
    d = () => new Date(Date.now() + 31536e6).toISOString();
    y = new e();
    l = class {
      constructor(e2) {
        this._pubKey = e2;
      }
      get bytes() {
        const e2 = create(identity2.code, this._pubKey.bytes);
        return CID.createV1(114, e2).bytes;
      }
      toString() {
        const e2 = create(identity2.code, this._pubKey.bytes);
        return CID.createV1(114, e2).toString(base36);
      }
    };
    w = class extends l {
      constructor(e2) {
        super(e2.public), this._privKey = e2;
      }
      get key() {
        return this._privKey;
      }
    };
    g = class _g {
      constructor(e2, t2, n2, r) {
        if (this._name = e2, "string" != typeof t2) throw new Error("invalid value");
        if (this._value = t2, "bigint" != typeof n2) throw new Error("invalid sequence number");
        if (this._sequence = n2, "string" != typeof r) throw new Error("invalid validity");
        this._validity = r;
      }
      get name() {
        return this._name;
      }
      get value() {
        return this._value;
      }
      get sequence() {
        return this._sequence;
      }
      get validity() {
        return this._validity;
      }
      static encode(e2) {
        return encode5({ name: e2._name.toString(), value: e2._value, sequence: e2._sequence, validity: e2._validity });
      }
      static decode(e2) {
        const t2 = decode6(e2), n2 = f(t2.name);
        return new _g(n2, t2.value, BigInt(t2.sequence), t2.validity);
      }
    };
  }
});

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    exports2.byteLength = byteLength;
    exports2.toByteArray = toByteArray;
    exports2.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code2.length; i < len; ++i) {
      lookup[i] = code2[i];
      revLookup[code2.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports2) {
    init_esbuild_shims();
    exports2.read = function(buffer2, offset, isLE, mLen, nBytes) {
      var e2, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d2 = isLE ? -1 : 1;
      var s = buffer2[offset + i];
      i += d2;
      e2 = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e2 = e2 * 256 + buffer2[offset + i], i += d2, nBits -= 8) {
      }
      m = e2 & (1 << -nBits) - 1;
      e2 >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d2, nBits -= 8) {
      }
      if (e2 === 0) {
        e2 = 1 - eBias;
      } else if (e2 === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e2 = e2 - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e2 - mLen);
    };
    exports2.write = function(buffer2, value, offset, isLE, mLen, nBytes) {
      var e2, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d2 = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e2 = eMax;
      } else {
        e2 = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e2)) < 1) {
          e2--;
          c *= 2;
        }
        if (e2 + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e2++;
          c /= 2;
        }
        if (e2 + eBias >= eMax) {
          m = 0;
          e2 = eMax;
        } else if (e2 + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e2 = e2 + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e2 = 0;
        }
      }
      for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d2, m /= 256, mLen -= 8) {
      }
      e2 = e2 << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer2[offset + i] = e2 & 255, i += d2, e2 /= 256, eLen -= 8) {
      }
      buffer2[offset + i - d2] |= s * 128;
    };
  }
});

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports2) {
    "use strict";
    init_esbuild_shims();
    var base642 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports2.Buffer = Buffer3;
    exports2.SlowBuffer = SlowBuffer;
    exports2.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports2.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e2) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length2) {
      if (length2 > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length2 + '" is invalid for option "size"');
      }
      const buf2 = new Uint8Array(length2);
      Object.setPrototypeOf(buf2, Buffer3.prototype);
      return buf2;
    }
    function Buffer3(arg, encodingOrOffset, length2) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe2(arg);
      }
      return from3(arg, encodingOrOffset, length2);
    }
    Buffer3.poolSize = 8192;
    function from3(value, encodingOrOffset, length2) {
      if (typeof value === "string") {
        return fromString4(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length2);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length2);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length2);
      }
      const b2 = fromObject(value);
      if (b2) return b2;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length2);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer3.from = function(value, encodingOrOffset, length2) {
      return from3(value, encodingOrOffset, length2);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc2(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc2(size, fill, encoding);
    };
    function allocUnsafe2(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe2(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe2(size);
    };
    function fromString4(string2, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length2 = byteLength(string2, encoding) | 0;
      let buf2 = createBuffer(length2);
      const actual = buf2.write(string2, encoding);
      if (actual !== length2) {
        buf2 = buf2.slice(0, actual);
      }
      return buf2;
    }
    function fromArrayLike(array) {
      const length2 = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf2 = createBuffer(length2);
      for (let i = 0; i < length2; i += 1) {
        buf2[i] = array[i] & 255;
      }
      return buf2;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length2) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length2 || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf2;
      if (byteOffset === void 0 && length2 === void 0) {
        buf2 = new Uint8Array(array);
      } else if (length2 === void 0) {
        buf2 = new Uint8Array(array, byteOffset);
      } else {
        buf2 = new Uint8Array(array, byteOffset, length2);
      }
      Object.setPrototypeOf(buf2, Buffer3.prototype);
      return buf2;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf2 = createBuffer(len);
        if (buf2.length === 0) {
          return buf2;
        }
        obj.copy(buf2, 0, 0, len);
        return buf2;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length2) {
      if (length2 >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length2 | 0;
    }
    function SlowBuffer(length2) {
      if (+length2 != length2) {
        length2 = 0;
      }
      return Buffer3.alloc(+length2);
    }
    Buffer3.isBuffer = function isBuffer3(b2) {
      return b2 != null && b2._isBuffer === true && b2 !== Buffer3.prototype;
    };
    Buffer3.compare = function compare2(a, b2) {
      if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b2, Uint8Array)) b2 = Buffer3.from(b2, b2.offset, b2.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b2)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b2) return 0;
      let x = a.length;
      let y2 = b2.length;
      for (let i = 0, len = Math.min(x, y2); i < len; ++i) {
        if (a[i] !== b2[i]) {
          x = a[i];
          y2 = b2[i];
          break;
        }
      }
      if (x < y2) return -1;
      if (y2 < x) return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat3(list, length2) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i;
      if (length2 === void 0) {
        length2 = 0;
        for (i = 0; i < list.length; ++i) {
          length2 += list[i].length;
        }
      }
      const buffer2 = Buffer3.allocUnsafe(length2);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf2 = list[i];
        if (isInstance(buf2, Uint8Array)) {
          if (pos + buf2.length > buffer2.length) {
            if (!Buffer3.isBuffer(buf2)) buf2 = Buffer3.from(buf2);
            buf2.copy(buffer2, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer2,
              buf2,
              pos
            );
          }
        } else if (!Buffer3.isBuffer(buf2)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf2.copy(buffer2, pos);
        }
        pos += buf2.length;
      }
      return buffer2;
    };
    function byteLength(string2, encoding) {
      if (Buffer3.isBuffer(string2)) {
        return string2.length;
      }
      if (ArrayBuffer.isView(string2) || isInstance(string2, ArrayBuffer)) {
        return string2.byteLength;
      }
      if (typeof string2 !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string2
        );
      }
      const len = string2.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes2(string2).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string2).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes2(string2).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice2(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b2, n2, m) {
      const i = b2[n2];
      b2[n2] = b2[m];
      b2[m] = i;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString4() {
      const length2 = this.length;
      if (length2 === 0) return "";
      if (arguments.length === 0) return utf8Slice2(this, 0, length2);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals4(b2) {
      if (!Buffer3.isBuffer(b2)) throw new TypeError("Argument must be a Buffer");
      if (this === b2) return true;
      return Buffer3.compare(this, b2) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports2.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer3.from(target, target.offset, target.byteLength);
      }
      if (!Buffer3.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y2 = end - start;
      const len = Math.min(x, y2);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y2 = targetCopy[i];
          break;
        }
      }
      if (x < y2) return -1;
      if (y2 < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
      if (buffer2.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer2.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
      if (byteOffset >= buffer2.length) {
        if (dir) return -1;
        else byteOffset = buffer2.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read2(buf2, i2) {
        if (indexSize === 1) {
          return buf2[i2];
        } else {
          return buf2.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read2(arr, i + j) !== read2(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf2, string2, offset, length2) {
      offset = Number(offset) || 0;
      const remaining = buf2.length - offset;
      if (!length2) {
        length2 = remaining;
      } else {
        length2 = Number(length2);
        if (length2 > remaining) {
          length2 = remaining;
        }
      }
      const strLen = string2.length;
      if (length2 > strLen / 2) {
        length2 = strLen / 2;
      }
      let i;
      for (i = 0; i < length2; ++i) {
        const parsed = parseInt(string2.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf2[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf2, string2, offset, length2) {
      return blitBuffer(utf8ToBytes2(string2, buf2.length - offset), buf2, offset, length2);
    }
    function asciiWrite(buf2, string2, offset, length2) {
      return blitBuffer(asciiToBytes(string2), buf2, offset, length2);
    }
    function base64Write(buf2, string2, offset, length2) {
      return blitBuffer(base64ToBytes(string2), buf2, offset, length2);
    }
    function ucs2Write(buf2, string2, offset, length2) {
      return blitBuffer(utf16leToBytes(string2, buf2.length - offset), buf2, offset, length2);
    }
    Buffer3.prototype.write = function write(string2, offset, length2, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length2 = this.length;
        offset = 0;
      } else if (length2 === void 0 && typeof offset === "string") {
        encoding = offset;
        length2 = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length2)) {
          length2 = length2 >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length2;
          length2 = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length2 === void 0 || length2 > remaining) length2 = remaining;
      if (string2.length > 0 && (length2 < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string2, offset, length2);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string2, offset, length2);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string2, offset, length2);
          case "base64":
            return base64Write(this, string2, offset, length2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string2, offset, length2);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf2, start, end) {
      if (start === 0 && end === buf2.length) {
        return base642.fromByteArray(buf2);
      } else {
        return base642.fromByteArray(buf2.slice(start, end));
      }
    }
    function utf8Slice2(buf2, start, end) {
      end = Math.min(buf2.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf2[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf2[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf2[i + 1];
              thirdByte = buf2[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf2[i + 1];
              thirdByte = buf2[i + 2];
              fourthByte = buf2[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray2(res);
    }
    var MAX_ARGUMENTS_LENGTH2 = 4096;
    function decodeCodePointsArray2(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH2) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH2)
        );
      }
      return res;
    }
    function asciiSlice(buf2, start, end) {
      let ret = "";
      end = Math.min(buf2.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf2[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf2, start, end) {
      let ret = "";
      end = Math.min(buf2.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf2[i]);
      }
      return ret;
    }
    function hexSlice(buf2, start, end) {
      const len = buf2.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf2[i]];
      }
      return out;
    }
    function utf16leSlice(buf2, start, end) {
      const bytes = buf2.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice2(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length2) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length2) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf2, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf2)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf2.length) throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf2, value, offset, min, max) {
      checkIntBI(value, min, max, buf2, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf2[offset++] = lo;
      lo = lo >> 8;
      buf2[offset++] = lo;
      lo = lo >> 8;
      buf2[offset++] = lo;
      lo = lo >> 8;
      buf2[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf2[offset++] = hi;
      hi = hi >> 8;
      buf2[offset++] = hi;
      hi = hi >> 8;
      buf2[offset++] = hi;
      hi = hi >> 8;
      buf2[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf2, value, offset, min, max) {
      checkIntBI(value, min, max, buf2, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf2[offset + 7] = lo;
      lo = lo >> 8;
      buf2[offset + 6] = lo;
      lo = lo >> 8;
      buf2[offset + 5] = lo;
      lo = lo >> 8;
      buf2[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf2[offset + 3] = hi;
      hi = hi >> 8;
      buf2[offset + 2] = hi;
      hi = hi >> 8;
      buf2[offset + 1] = hi;
      hi = hi >> 8;
      buf2[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf2, value, offset, ext, max, min) {
      if (offset + ext > buf2.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf2, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf2, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf2, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf2, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf2, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf2, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer3.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code2 = val.charCodeAt(0);
          if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
            val = code2;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name2) {
        if (name2) {
          return `${name2} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name2, actual) {
        return `The "${name2}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf2, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf2[offset] === void 0 || buf2[offset + byteLength2] === void 0) {
        boundsError(offset, buf2.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf2, offset, byteLength2) {
      if (value > max || value < min) {
        const n2 = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n2} and < 2${n2} ** ${(byteLength2 + 1) * 8}${n2}`;
          } else {
            range = `>= -(2${n2} ** ${(byteLength2 + 1) * 8 - 1}${n2}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n2}`;
          }
        } else {
          range = `>= ${min}${n2} and <= ${max}${n2}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf2, offset, byteLength2);
    }
    function validateNumber(value, name2) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name2, "number", value);
      }
    }
    function boundsError(value, length2, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length2 < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length2}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes2(string2, units) {
      units = units || Infinity;
      let codePoint;
      const length2 = string2.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length2; ++i) {
        codePoint = string2.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length2) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base642.toByteArray(base64clean(str));
    }
    function blitBuffer(src2, dst, offset, length2) {
      let i;
      for (i = 0; i < length2; ++i) {
        if (i + offset >= dst.length || i >= src2.length) break;
        dst[i + offset] = src2[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = function() {
      const alphabet2 = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet2[i] + alphabet2[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// esbuild-shims.js
var import_buffer;
var init_esbuild_shims = __esm({
  "esbuild-shims.js"() {
    "use strict";
    init_dist();
    import_buffer = __toESM(require_buffer(), 1);
    globalThis.require = (name2) => {
      if (name2 === "ethers") {
        return ethers;
      }
      throw new Error("unknown module " + name2);
    };
    globalThis.W3Name = dist_exports;
    globalThis.Buffer = import_buffer.Buffer;
  }
});

// src/lit-actions/thresholdRecovery.ts
init_esbuild_shims();
(async () => {
  let stringifiedApiKey;
  let namePrivateKey;
  const signatures = [];
  const addresses = [];
  const threshold = 0;
  try {
    try {
      stringifiedApiKey = await Lit.Actions.decryptAndCombine({
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig: null,
        chain: "ethereum"
      });
      namePrivateKey = new Uint8Array(
        Buffer.from(stringifiedApiKey.trim(), "base64")
      );
    } catch (error) {
      console.error(error);
      Lit.Actions.setResponse({
        response: JSON.stringify({
          success: false,
          message: "Failed to decrypt the API key"
        })
      });
    }
    const res = await Lit.Actions.runOnce(
      {
        waitForResponse: true,
        name: "conditional-threshold-check-ipns-record-update"
      },
      async () => {
        const usedAddresses = [];
        const name2 = W3Name.parse(ipns);
        const revision = await W3Name.resolve(name2);
        const sequence = revision.sequence;
        for (const signature of signatures) {
          const recoveredAddress = ethers.utils.recoverAddress(
            signature,
            `I acknowledge updating the current ipns record : ${ipns} contents to point to this new ipfs cid : ${newCid} and the previous sequence number is ${sequence}`
          );
          if (addresses.includes(recoveredAddress.toLowerCase()) && !usedAddresses.includes(recoveredAddress.toLowerCase())) {
            usedAddresses.push(recoveredAddress.toLowerCase());
          }
        }
        const nextRevision = await W3Name.increment(
          revision,
          newCid.replace("\n", "")
        );
        if (usedAddresses.length >= threshold) {
          const nameKey = await W3Name.from(namePrivateKey);
          const resp = await W3Name.publish(nextRevision, nameKey.key);
          return `Threshold reached, updated IPNS record ${ipns} with new CID ${newCid.replace("\n", "")}`;
        } else {
          return `Threshold not reached, required: ${threshold}, got: ${usedAddresses.length}`;
        }
      }
    );
    Lit.Actions.setResponse({
      response: JSON.stringify({
        success: true,
        message: JSON.stringify(res)
      })
    });
  } catch (error) {
    console.error(error);
    Lit.Actions.setResponse({
      response: JSON.stringify({
        success: false,
        message: JSON.stringify(error.message),
        stack: JSON.stringify(error.stack)
      })
    });
  }
})();
/*! Bundled license information:

@noble/ed25519/lib/index.js:
  (*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)

@noble/secp256k1/lib/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
