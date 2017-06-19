#include <node.h>
#include <node_object_wrap.h>
#include "..\includes\NexusSentry.h"

namespace addon {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void InitAll(Local<Object> exports) {
  NexusSentry::Init(exports);
}

NODE_MODULE(addon, InitAll)

}  // namespace demo
