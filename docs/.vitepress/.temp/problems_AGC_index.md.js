import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"AGC 题解目录","description":"","frontmatter":{"title":"AGC 题解目录"},"headers":[],"relativePath":"problems/AGC/index.md","filePath":"problems/AGC/index.md"}');
const _sfc_main = { name: "problems/AGC/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AGCIndex = resolveComponent("AGCIndex");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="atcoder-grand-contest-agc" tabindex="-1">AtCoder Grand Contest（AGC） <a class="header-anchor" href="#atcoder-grand-contest-agc" aria-label="Permalink to &quot;AtCoder Grand Contest（AGC）&quot;">​</a></h1><p>这里收录 AGC 系列题解。</p>`);
  _push(ssrRenderComponent(_component_AGCIndex, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("problems/AGC/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
