#include <node.h>
#include "..\include\NexusSentry.h"

namespace addon {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  NexusSentry::Init(exports);
}

NODE_MODULE(addon, InitAll)

}  // namespace demo
