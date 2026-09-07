// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

process.env.NEXT_PUBLIC_BACKEND_HOST = "http://localhost:8080"
process.env.NEXT_PUBLIC_AUTHZ_SERVICE = "http://localhost:8020"
process.env.NEXT_PUBLIC_AUTHZ_ENDPOINT = "/realms/spreact/protocol/openid-connect/auth"
process.env.NEXT_PUBLIC_LOGIN_ENDPOINT = "/realms/spreact/login-actions/authenticate"
process.env.NEXT_PUBLIC_TOKEN_ENDPOINT = "/realms/spreact/protocol/openid-connect/token"
process.env.NEXT_PUBLIC_WELL_KNOWN_ENDPOINT = "/realms/spreact/.well-known/openid-configuration"
process.env.NEXT_PUBLIC_JWKS_ENDPOINT = "/realms/spreact/protocol/openid-connect/certs"
process.env.NEXT_PUBLIC_TOKEN_ISSUER = "http://localhost:8020/realms/spreact"