import React, { useRef, useState } from "react";
import defaultAvatar from "../../assets/default-avatar.png";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";

import { UserData } from "../../context/UserContext";

const ProfileImageUploader = ({ user }) => {
  // Always use Gravatar based on email, or fallback to default avatar
  const getGravatar = (email) => {
    if (!email) return defaultAvatar;
    // Use a simple md5 implementation for Gravatar (or use a CDN/global md5 if available)
    const md5 = (string) => {
      // Lightweight JS MD5 implementation (for demo only)
      function L(k, d) {
        return (k << d) | (k >>> (32 - d));
      }
      function K(G, k) {
        var I, d, F, H, x;
        F = (G & 2147483648);
        H = (k & 2147483648);
        I = (G & 1073741824);
        d = (k & 1073741824);
        x = (G & 1073741823) + (k & 1073741823);
        if (I & d) {
          return (x ^ 2147483648 ^ F ^ H);
        }
        if (I | d) {
          if (x & 1073741824) {
            return (x ^ 3221225472 ^ F ^ H);
          } else {
            return (x ^ 1073741824 ^ F ^ H);
          }
        } else {
          return (x ^ F ^ H);
        }
      }
      function r(d, F, k) {
        return (d & F) | ((~d) & k);
      }
      function q(d, F, k) {
        return (d & k) | (F & (~k));
      }
      function p(d, F, k) {
        return (d ^ F ^ k);
      }
      function n(d, F, k) {
        return (F ^ (d | (~k)));
      }
      function u(G, F, aa, Z, k, H, I) {
        G = K(G, K(K(r(F, aa, Z), k), I));
        return K(L(G, H), F);
      }
      function f(G, F, aa, Z, k, H, I) {
        G = K(G, K(K(q(F, aa, Z), k), I));
        return K(L(G, H), F);
      }
      function D(G, F, aa, Z, k, H, I) {
        G = K(G, K(K(p(F, aa, Z), k), I));
        return K(L(G, H), F);
      }
      function t(G, F, aa, Z, k, H, I) {
        G = K(G, K(K(n(F, aa, Z), k), I));
        return K(L(G, H), F);
      }
      function e(G) {
        var Z;
        var F = G.length;
        var x = F + 8;
        var k = (x - (x % 64)) / 64;
        var I = (k + 1) * 16;
        var aa = Array(I - 1);
        var d = 0;
        var H = 0;
        while (H < F) {
          Z = (H - (H % 4)) / 4;
          d = (H % 4) * 8;
          aa[Z] = (aa[Z] | (G.charCodeAt(H) << d));
          H++;
        }
        Z = (H - (H % 4)) / 4;
        d = (H % 4) * 8;
        aa[Z] = aa[Z] | (128 << d);
        aa[I - 2] = F << 3;
        aa[I - 1] = F >>> 29;
        return aa;
      }
      function B(x) {
        var k = "", F = "", G, d;
        for (d = 0; d <= 3; d++) {
          G = (x >>> (d * 8)) & 255;
          F = "0" + G.toString(16);
          k += F.substr(F.length - 2, 2);
        }
        return k;
      }
      var C = [], P, h, E, v, g, Y, X, W, V;
      string = string.replace(/\r\n/g, "\n");
      var U = "";
      for (var S = 0; S < string.length; S++) {
        var T = string.charCodeAt(S);
        if (T < 128) {
          U += String.fromCharCode(T);
        } else if ((T > 127) && (T < 2048)) {
          U += String.fromCharCode((T >> 6) | 192);
          U += String.fromCharCode((T & 63) | 128);
        } else {
          U += String.fromCharCode((T >> 12) | 224);
          U += String.fromCharCode(((T >> 6) & 63) | 128);
          U += String.fromCharCode((T & 63) | 128);
        }
      }
      C = e(U);
      Y = 1732584193;
      X = 4023233417;
      W = 2562383102;
      V = 271733878;
      for (P = 0; P < C.length; P += 16) {
        h = Y;
        E = X;
        v = W;
        g = V;
        Y = u(Y, X, W, V, C[P + 0], 7, 3614090360);
        V = u(V, Y, X, W, C[P + 1], 12, 3905402710);
        W = u(W, V, Y, X, C[P + 2], 17, 606105819);
        X = u(X, W, V, Y, C[P + 3], 22, 3250441966);
        Y = u(Y, X, W, V, C[P + 4], 7, 4118548399);
        V = u(V, Y, X, W, C[P + 5], 12, 1200080426);
        W = u(W, V, Y, X, C[P + 6], 17, 2821735955);
        X = u(X, W, V, Y, C[P + 7], 22, 4249261313);
        Y = u(Y, X, W, V, C[P + 8], 7, 1770035416);
        V = u(V, Y, X, W, C[P + 9], 12, 2336552879);
        W = u(W, V, Y, X, C[P + 10], 17, 4294925233);
        X = u(X, W, V, Y, C[P + 11], 22, 2304563134);
        Y = u(Y, X, W, V, C[P + 12], 7, 1804603682);
        V = u(V, Y, X, W, C[P + 13], 12, 4254626195);
        W = u(W, V, Y, X, C[P + 14], 17, 2792965006);
        X = u(X, W, V, Y, C[P + 15], 22, 1236535329);
        Y = f(Y, X, W, V, C[P + 1], 5, 4129170786);
        V = f(V, Y, X, W, C[P + 6], 9, 3225465664);
        W = f(W, V, Y, X, C[P + 11], 14, 643717713);
        X = f(X, W, V, Y, C[P + 0], 20, 3921069994);
        Y = f(Y, X, W, V, C[P + 5], 5, 3593408605);
        V = f(V, Y, X, W, C[P + 10], 9, 38016083);
        W = f(W, V, Y, X, C[P + 15], 14, 3634488961);
        X = f(X, W, V, Y, C[P + 4], 20, 3889429448);
        Y = f(Y, X, W, V, C[P + 9], 5, 568446438);
        V = f(V, Y, X, W, C[P + 14], 9, 3275163606);
        W = f(W, V, Y, X, C[P + 3], 14, 4107603335);
        X = f(X, W, V, Y, C[P + 8], 20, 1163531501);
        Y = D(Y, X, W, V, C[P + 1], 4, 2850285829);
        V = D(V, Y, X, W, C[P + 6], 11, 4243563512);
        W = D(W, V, Y, X, C[P + 11], 16, 1735328473);
        X = D(X, W, V, Y, C[P + 0], 23, 2368359562);
        Y = D(Y, X, W, V, C[P + 5], 4, 4294588738);
        V = D(V, Y, X, W, C[P + 10], 11, 2272392833);
        W = D(W, V, Y, X, C[P + 15], 16, 1839030562);
        X = D(X, W, V, Y, C[P + 4], 23, 4259657740);
        Y = t(Y, X, W, V, C[P + 9], 6, 2763975236);
        V = t(V, Y, X, W, C[P + 14], 10, 1272893353);
        W = t(W, V, Y, X, C[P + 3], 15, 4139469664);
        X = t(X, W, V, Y, C[P + 8], 21, 3200236656);
        Y = t(Y, X, W, V, C[P + 13], 6, 681279174);
        V = t(V, Y, X, W, C[P + 0], 10, 2820333397);
        W = t(W, V, Y, X, C[P + 7], 15, 4218158359);
        X = t(X, W, V, Y, C[P + 15], 21, 3182448122);
        Y = t(Y, X, W, V, C[P + 6], 6, 4249261313);
        V = t(V, Y, X, W, C[P + 13], 10, 1732584193);
        W = t(W, V, Y, X, C[P + 4], 15, 2368359562);
        X = t(X, W, V, Y, C[P + 11], 21, 4294588738);
        Y = K(Y, h);
        X = K(X, E);
        W = K(W, v);
        V = K(V, g);
      }
      var i = B(Y) + B(X) + B(W) + B(V);
      return i.toLowerCase();
    };
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const avatarSrc = getGravatar(user?.email);

  return (
    <div className="profile-img-uploader">
      <img
        src={avatarSrc}
        alt="Profile"
        className="profile-img-avatar"
      />
      <div className="profile-img-label">Profile Photo (via Email)</div>
    </div>
  );
};

export default ProfileImageUploader;
