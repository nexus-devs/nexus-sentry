#include <NexusSentry.h>
#include <OCR.h>

namespace addon {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::Persistent;
using v8::String;
using v8::Value;

Persistent<Function> NexusSentry::constructor;

NexusSentry::NexusSentry(double value) {}
NexusSentry::~NexusSentry() {}

/**
 * Make Class usable in Node.js
 */
void NexusSentry::Init(Local<Object> exports) {
  Isolate *isolate = exports->GetIsolate();

  // Prepare constructor template
  Local<FunctionTemplate> ObjectConstructor =
      FunctionTemplate::New(isolate, New);
  ObjectConstructor->SetClassName(String::NewFromUtf8(isolate, "NexusSentry"));
  ObjectConstructor->InstanceTemplate()->SetInternalFieldCount(1);

  // Extend object prototype with methods
  NODE_SET_PROTOTYPE_METHOD(ObjectConstructor, "scan", scan);

  constructor.Reset(isolate, ObjectConstructor->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "NexusSentry"),
               ObjectConstructor->GetFunction());
}

/**
 * Define constructor logic
 */
void NexusSentry::New(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();

  // Invoked as constructor: `new NexusSentry(...)`
  if (args.IsConstructCall()) {
    double value = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
    NexusSentry *obj = new NexusSentry(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  }

  // Invoked as plain function `NexusSentry(...)`, turn into construct call.
  else {
    const int argc = 1;
    Local<Value> argv[argc] = {args[0]};
    Local<Context> context = isolate->GetCurrentContext();
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

/**
 * Analyze screenshot in Tesseract
 */
void NexusSentry::scan(const FunctionCallbackInfo<Value>& args) {
    OCR::scan();
}
}  // addon namespace
