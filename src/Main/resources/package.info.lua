return { InfoVersion = 1, -- Dont touch this

    ID = "CoreLauncher",
    Name = "CoreLauncher",
    Description = "CoreLauncher",
    Version = "2.0.0",

    Author = {
        Developers = {
            "CoreByte"
        },
        Contributors = {}
    },

    Dependencies = {
        Luvit = {
            "creationix/coro-http",
            "creationix/coro-spawn",
            "creationix/base64",
            "creationix/uuid4",
            "creationix/coro-fs",
            "creationix/md5",
            "luvit/secure-socket",
        },
        Git = {},
        Dua = {}
    },

    Contact = {
        Website = "https://cubic-inc.ga",
        Source = "https://github.com/Dot-lua/TypeWriter/",
        Socials = {}
    },

    Entrypoints = {
        Main = "ga.CoreLauncher"
    }
}