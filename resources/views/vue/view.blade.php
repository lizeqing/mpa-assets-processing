<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Laravel</title>

        @php
            $entrypoints = json_decode(file_get_contents(public_path('dist/entrypoints.json')), JSON_OBJECT_AS_ARRAY);
            $entry = $entrypoints['vue'];
        @endphp

        @foreach ($entry['css'] as $css)
            <link rel="stylesheet" href="/dist/{{ $css }}">
        @endforeach
    </head>
    <body>
        <div id="app"></div>

        @foreach ($entry['js'] as $js)
            <script src="/dist/{{ $js }}"></script>
        @endforeach
    </body>
</html>
