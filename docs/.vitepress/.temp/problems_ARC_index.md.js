import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"ARC 题解目录","description":"","frontmatter":{"title":"ARC 题解目录"},"headers":[],"relativePath":"problems/ARC/index.md","filePath":"problems/ARC/index.md"}');
const _sfc_main = { name: "problems/ARC/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ARCIndex = resolveComponent("ARCIndex");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="atcoder-regular-contest-arc" tabindex="-1">AtCoder Regular Contest（ARC） <a class="header-anchor" href="#atcoder-regular-contest-arc" aria-label="Permalink to &quot;AtCoder Regular Contest（ARC）&quot;">​</a></h1><p>这里收录 ARC 系列题解。</p>`);
  _push(ssrRenderComponent(_component_ARCIndex, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("problems/ARC/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
